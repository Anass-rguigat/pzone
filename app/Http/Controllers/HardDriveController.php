<?php

namespace App\Http\Controllers;

use App\Models\HardDrive;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HardDriveController extends Controller {
    public function index() {
        $hardDrives = HardDrive::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('HardDrives/Index', ['hardDrives' => $hardDrives]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('HardDrives/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|in:hdd,ssd,nvme',
            'capacity' => 'required|integer|min:1',
            'interface' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the HardDrive record
        $hardDrive = HardDrive::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'interface' => $validated['interface'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $hardDrive->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hard_drives', 'public');
            $hardDrive->image()->create(['url' => $path]);
        }

        return redirect()->route('hard-drives.index');
    }

    public function edit(HardDrive $hardDrive) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $hardDrive->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('HardDrives/Edit', [
            'hardDrive' => $hardDrive,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update HardDrive
    public function update(Request $request, HardDrive $hardDrive) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'nullable|in:hdd,ssd,nvme',
            'capacity' => 'nullable|integer|min:1',
            'interface' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the HardDrive model with the validated data
        $hardDrive->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $hardDrive->price,
            'capacity' => $validated['capacity'] ?? $hardDrive->capacity, // Keep the existing capacity if not provided
            'type' => $validated['type'] ?? $hardDrive->type, // Keep the existing type if not provided
            'interface' => $validated['interface'] ?? $hardDrive->interface, // Keep the existing interface if not provided
            'stock' => $validated['stock'] ?? $hardDrive->stock, // Keep the existing stock if not provided
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $hardDrive->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($hardDrive->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($hardDrive->image->url);
                // Delete the old image record
                $hardDrive->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('hard_drives', 'public');

            // Create a new image record associated with the HardDrive
            $hardDrive->image()->create(['url' => $path]);
        }

        // Redirect back to the HardDrive index or show the updated HardDrive
        return redirect()->route('hard-drives.index');
    }

    public function show(HardDrive $hardDrive) {
        // Load the related brand, image, and servers
        $hardDrive->load('brand', 'image', 'servers');

        // Pass the HardDrive data to the Inertia view
        return Inertia::render('HardDrives/Show', [
            'hardDrive' => $hardDrive,
        ]);
    }

    public function destroy(HardDrive $hardDrive) {
        // Delete the related image if it exists
        if ($hardDrive->image) {
            Storage::disk('public')->delete($hardDrive->image->url);
            $hardDrive->image()->delete();
        }

        // Detach servers if any are attached
        $hardDrive->servers()->detach();

        // Delete the HardDrive
        $hardDrive->delete();

        return redirect()->route('hard-drives.index');
    }
}
