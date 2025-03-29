<?php

namespace App\Http\Controllers;

use App\Models\Ram;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RamController extends Controller {
    public function index() {
        $rams = Ram::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('Rams/Index', ['rams' => $rams]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('Rams/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|in:ddr3,ddr4,ddr5',
            'speed' => 'required|integer|min:1',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
        ]);

        // Create the RAM record
        $ram = Ram::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
            'type' => $validated['type'],
            'speed' => $validated['speed'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $ram->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('rams', 'public');
            $ram->image()->create(['url' => $path]);
        }

        return redirect()->route('rams.index');
    }

    public function edit(Ram $ram)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $ram->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('Rams/Edit', [
            'ram' => $ram,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update RAM
    public function update(Request $request, Ram $ram) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'capacity' => 'nullable|integer|min:1',
            'type' => 'nullable|in:ddr3,ddr4,ddr5',
            'speed' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
        ]);
    
        // Update the RAM model with the validated data
        $ram->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $ram->price,
            'capacity' => $validated['capacity'] ?? $ram->capacity, // Keep the existing capacity if not provided
            'type' => $validated['type'] ?? $ram->type, // Keep the existing type if not provided
            'speed' => $validated['speed'] ?? $ram->speed, // Keep the existing price if not provided
        ]);
    
        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $ram->servers()->sync($validated['server_ids']);
        }
    
        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($ram->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($ram->image->url);
                // Delete the old image record
                $ram->image()->delete();
            }
    
            // Store the new image
            $path = $request->file('image')->store('rams', 'public');
    
            // Create a new image record associated with the RAM
            $ram->image()->create(['url' => $path]);
        }
    
        // Redirect back to the RAM index or show the updated RAM
        return redirect()->route('rams.index');
    }
    
    
    

    public function show(Ram $ram) {
        // Load the related brand, image, and servers
        $ram->load('brand', 'image', 'servers');
    
        // Pass the RAM data to the Inertia view
        return Inertia::render('Rams/Show', [
            'ram' => $ram,
        ]);
    }
    
    public function destroy(Ram $ram) {
        // Delete the related image if it exists
        if ($ram->image) {
            Storage::disk('public')->delete($ram->image->url);
            $ram->image()->delete();
        }

        // Detach servers if any are attached
        $ram->servers()->detach();

        // Delete the RAM
        $ram->delete();

        return redirect()->route('rams.index');
    }
}
