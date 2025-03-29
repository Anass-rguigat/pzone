<?php

namespace App\Http\Controllers;

use App\Models\Chassis;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChassisController extends Controller {
    public function index() {
        $chassis = Chassis::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('Chassis/Index', ['chassis' => $chassis]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('Chassis/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'form_factor' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Chassis record
        $chassis = Chassis::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'],
            'material' => $validated['material'],
            'price' => $validated['price'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $chassis->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chassis', 'public');
            $chassis->image()->create(['url' => $path]);
        }

        return redirect()->route('chassis.index');
    }

    public function edit(Chassis $chassis) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $chassis->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('Chassis/Edit', [
            'chassis' => $chassis,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Chassis
    public function update(Request $request, Chassis $chassis) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'form_factor' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Chassis model with the validated data
        $chassis->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? $chassis->type,
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'] ?? $chassis->form_factor,
            'material' => $validated['material'] ?? $chassis->material,
            'price' => $validated['price'] ?? $chassis->price,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $chassis->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($chassis->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($chassis->image->url);
                // Delete the old image record
                $chassis->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('chassis', 'public');

            // Create a new image record associated with the Chassis
            $chassis->image()->create(['url' => $path]);
        }

        // Redirect back to the Chassis index or show the updated Chassis
        return redirect()->route('chassis.index');
    }

    public function show(Chassis $chassis) {
        // Load the related brand, image, and servers
        $chassis->load('brand', 'image', 'servers');

        // Pass the Chassis data to the Inertia view
        return Inertia::render('Chassis/Show', [
            'chassis' => $chassis,
        ]);
    }

    public function destroy(Chassis $chassis) {
        // Delete the related image if it exists
        if ($chassis->image) {
            Storage::disk('public')->delete($chassis->image->url);
            $chassis->image()->delete();
        }

        // Detach servers if any are attached
        $chassis->servers()->detach();

        // Delete the Chassis
        $chassis->delete();

        return redirect()->route('chassis.index');
    }
}
