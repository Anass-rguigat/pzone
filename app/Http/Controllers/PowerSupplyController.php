<?php

namespace App\Http\Controllers;

use App\Models\PowerSupply;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PowerSupplyController extends Controller {
    public function index() {
        $powerSupplies = PowerSupply::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('PowerSupplies/Index', ['powerSupplies' => $powerSupplies]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('PowerSupplies/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'efficiency' => 'required|string|max:255',
            'form_factor' => 'required|string|max:255',
            'modular' => 'required|boolean',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Power Supply record
        $powerSupply = PowerSupply::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
            'efficiency' => $validated['efficiency'],
            'form_factor' => $validated['form_factor'],
            'modular' => $validated['modular'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $powerSupply->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('power_supplies', 'public');
            $powerSupply->image()->create(['url' => $path]);
        }

        return redirect()->route('power-supplies.index');
    }

    public function edit(PowerSupply $powerSupply) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $powerSupply->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('PowerSupplies/Edit', [
            'powerSupply' => $powerSupply,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Power Supply
    public function update(Request $request, PowerSupply $powerSupply) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
            'efficiency' => 'nullable|string|max:255',
            'form_factor' => 'nullable|string|max:255',
            'modular' => 'nullable|boolean',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Power Supply model with the validated data
        $powerSupply->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $powerSupply->price,
            'capacity' => $validated['capacity'] ?? $powerSupply->capacity,
            'efficiency' => $validated['efficiency'] ?? $powerSupply->efficiency,
            'form_factor' => $validated['form_factor'] ?? $powerSupply->form_factor,
            'modular' => $validated['modular'] ?? $powerSupply->modular,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $powerSupply->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($powerSupply->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($powerSupply->image->url);
                // Delete the old image record
                $powerSupply->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('power_supplies', 'public');

            // Create a new image record associated with the Power Supply
            $powerSupply->image()->create(['url' => $path]);
        }

        // Redirect back to the Power Supply index or show the updated Power Supply
        return redirect()->route('power-supplies.index');
    }

    public function show(PowerSupply $powerSupply) {
        // Load the related brand, image, and servers
        $powerSupply->load('brand', 'image', 'servers');

        // Pass the Power Supply data to the Inertia view
        return Inertia::render('PowerSupplies/Show', [
            'powerSupply' => $powerSupply,
        ]);
    }

    public function destroy(PowerSupply $powerSupply) {
        // Delete the related image if it exists
        if ($powerSupply->image) {
            Storage::disk('public')->delete($powerSupply->image->url);
            $powerSupply->image()->delete();
        }

        // Detach servers if any are attached
        $powerSupply->servers()->detach();

        // Delete the Power Supply
        $powerSupply->delete();

        return redirect()->route('power-supplies.index');
    }
}
