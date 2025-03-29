<?php

namespace App\Http\Controllers;

use App\Models\Processor;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProcessorController extends Controller {
    public function index() {
        $processors = Processor::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('Processors/Index', ['processors' => $processors]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('Processors/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'core_count' => 'required|integer|min:1',
            'thread_count' => 'required|integer|min:1',
            'base_clock' => 'required|numeric|min:0',
            'boost_clock' => 'required|numeric|min:0',
            'socket' => 'required|string|max:255',
            'thermal_design_power' => 'required|integer|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Processor record
        $processor = Processor::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'core_count' => $validated['core_count'],
            'thread_count' => $validated['thread_count'],
            'base_clock' => $validated['base_clock'],
            'boost_clock' => $validated['boost_clock'],
            'socket' => $validated['socket'],
            'thermal_design_power' => $validated['thermal_design_power'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $processor->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('processors', 'public');
            $processor->image()->create(['url' => $path]);
        }

        return redirect()->route('processors.index');
    }

    public function edit(Processor $processor) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $processor->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('Processors/Edit', [
            'processor' => $processor,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Processor
    public function update(Request $request, Processor $processor) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'nullable|string|max:255',
            'core_count' => 'nullable|integer|min:1',
            'thread_count' => 'nullable|integer|min:1',
            'base_clock' => 'nullable|numeric|min:0',
            'boost_clock' => 'nullable|numeric|min:0',
            'socket' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'thermal_design_power' => 'nullable|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Processor model with the validated data
        $processor->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $processor->model,
            'price' => $validated['price'] ?? $processor->price,
            'core_count' => $validated['core_count'] ?? $processor->core_count,
            'thread_count' => $validated['thread_count'] ?? $processor->thread_count,
            'base_clock' => $validated['base_clock'] ?? $processor->base_clock,
            'boost_clock' => $validated['boost_clock'] ?? $processor->boost_clock,
            'socket' => $validated['socket'] ?? $processor->socket,
            'thermal_design_power' => $validated['thermal_design_power'] ?? $processor->thermal_design_power,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $processor->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($processor->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($processor->image->url);
                // Delete the old image record
                $processor->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('processors', 'public');

            // Create a new image record associated with the Processor
            $processor->image()->create(['url' => $path]);
        }

        // Redirect back to the Processor index or show the updated Processor
        return redirect()->route('processors.index');
    }

    public function show(Processor $processor) {
        // Load the related brand, image, and servers
        $processor->load('brand', 'image', 'servers');

        // Pass the Processor data to the Inertia view
        return Inertia::render('Processors/Show', [
            'processor' => $processor,
        ]);
    }

    public function destroy(Processor $processor) {
        // Delete the related image if it exists
        if ($processor->image) {
            Storage::disk('public')->delete($processor->image->url);
            $processor->image()->delete();
        }

        // Detach servers if any are attached
        $processor->servers()->detach();

        // Delete the Processor
        $processor->delete();

        return redirect()->route('processors.index');
    }
}
