<?php

namespace App\Http\Controllers;

use App\Models\CoolingSolution;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CoolingSolutionController extends Controller {
    public function index() {
        $coolingSolutions = CoolingSolution::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('CoolingSolutions/Index', ['coolingSolutions' => $coolingSolutions]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('CoolingSolutions/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'manufacturer' => 'required|string|max:255',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Cooling Solution record
        $coolingSolution = CoolingSolution::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'manufacturer' => $validated['manufacturer'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $coolingSolution->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cooling_solutions', 'public');
            $coolingSolution->image()->create(['url' => $path]);
        }

        return redirect()->route('cooling-solutions.index');
    }

    public function edit(CoolingSolution $coolingSolution) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $coolingSolution->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('CoolingSolutions/Edit', [
            'coolingSolution' => $coolingSolution,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Cooling Solution
    public function update(Request $request, CoolingSolution $coolingSolution) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'manufacturer' => 'nullable|string|max:255',
            'power_rating' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Cooling Solution model with the validated data
        $coolingSolution->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? $coolingSolution->type,
            'brand_id' => $validated['brand_id'],
            'manufacturer' => $validated['manufacturer'] ?? $coolingSolution->manufacturer,
            'power_rating' => $validated['power_rating'] ?? $coolingSolution->power_rating,
            'price' => $validated['price'] ?? $coolingSolution->price,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $coolingSolution->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($coolingSolution->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($coolingSolution->image->url);
                // Delete the old image record
                $coolingSolution->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('cooling_solutions', 'public');

            // Create a new image record associated with the Cooling Solution
            $coolingSolution->image()->create(['url' => $path]);
        }

        // Redirect back to the Cooling Solution index or show the updated Cooling Solution
        return redirect()->route('cooling-solutions.index');
    }

    public function show(CoolingSolution $coolingSolution) {
        // Load the related brand, image, and servers
        $coolingSolution->load('brand', 'image', 'servers');

        // Pass the Cooling Solution data to the Inertia view
        return Inertia::render('CoolingSolutions/Show', [
            'coolingSolution' => $coolingSolution,
        ]);
    }

    public function destroy(CoolingSolution $coolingSolution) {
        // Delete the related image if it exists
        if ($coolingSolution->image) {
            Storage::disk('public')->delete($coolingSolution->image->url);
            $coolingSolution->image()->delete();
        }

        // Detach servers if any are attached
        $coolingSolution->servers()->detach();

        // Delete the Cooling Solution
        $coolingSolution->delete();

        return redirect()->route('cooling-solutions.index');
    }
}
