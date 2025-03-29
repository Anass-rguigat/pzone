<?php

namespace App\Http\Controllers;

use App\Models\Motherboard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MotherboardController extends Controller {
    public function index() {
        $motherboards = Motherboard::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('Motherboards/Index', ['motherboards' => $motherboards]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('Motherboards/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'cpu_socket' => 'required|string|max:255',
            'chipset' => 'required|string|max:255',
            'ram_slots' => 'required|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'pci_slots' => 'required|integer|min:1',
            'form_factor' => 'required|string|max:255',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Motherboard record
        $motherboard = Motherboard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'cpu_socket' => $validated['cpu_socket'],
            'chipset' => $validated['chipset'],
            'ram_slots' => $validated['ram_slots'],
            'pci_slots' => $validated['pci_slots'],
            'form_factor' => $validated['form_factor'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $motherboard->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('motherboards', 'public');
            $motherboard->image()->create(['url' => $path]);
        }

        return redirect()->route('motherboards.index');
    }

    public function edit(Motherboard $motherboard) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $motherboard->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('Motherboards/Edit', [
            'motherboard' => $motherboard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Motherboard
    public function update(Request $request, Motherboard $motherboard) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'nullable|string|max:255',
            'cpu_socket' => 'nullable|string|max:255',
            'chipset' => 'nullable|string|max:255',
            'ram_slots' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'pci_slots' => 'nullable|integer|min:1',
            'form_factor' => 'nullable|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Motherboard model with the validated data
        $motherboard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $motherboard->model,
            'price' => $validated['price'] ?? $motherboard->price,
            'cpu_socket' => $validated['cpu_socket'] ?? $motherboard->cpu_socket,
            'chipset' => $validated['chipset'] ?? $motherboard->chipset,
            'ram_slots' => $validated['ram_slots'] ?? $motherboard->ram_slots,
            'pci_slots' => $validated['pci_slots'] ?? $motherboard->pci_slots,
            'form_factor' => $validated['form_factor'] ?? $motherboard->form_factor,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $motherboard->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($motherboard->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($motherboard->image->url);
                // Delete the old image record
                $motherboard->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('motherboards', 'public');

            // Create a new image record associated with the Motherboard
            $motherboard->image()->create(['url' => $path]);
        }

        // Redirect back to the Motherboard index or show the updated Motherboard
        return redirect()->route('motherboards.index');
    }

    public function show(Motherboard $motherboard) {
        // Load the related brand, image, and servers
        $motherboard->load('brand', 'image', 'servers');

        // Pass the Motherboard data to the Inertia view
        return Inertia::render('Motherboards/Show', [
            'motherboard' => $motherboard,
        ]);
    }

    public function destroy(Motherboard $motherboard) {
        // Delete the related image if it exists
        if ($motherboard->image) {
            Storage::disk('public')->delete($motherboard->image->url);
            $motherboard->image()->delete();
        }

        // Detach servers if any are attached
        $motherboard->servers()->detach();

        // Delete the Motherboard
        $motherboard->delete();

        return redirect()->route('motherboards.index');
    }
}
