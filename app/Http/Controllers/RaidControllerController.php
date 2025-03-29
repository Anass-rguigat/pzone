<?php

namespace App\Http\Controllers;

use App\Models\RaidController;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RaidControllerController extends Controller {
    public function index() {
        $raidControllers = RaidController::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('RaidControllers/Index', ['raidControllers' => $raidControllers]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('RaidControllers/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'model' => 'required|string|max:255',
            'supported_levels' => 'required|string|max:255',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Raid Controller record
        $raidController = RaidController::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'model' => $validated['model'],
            'supported_levels' => $validated['supported_levels'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $raidController->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('raid_controllers', 'public');
            $raidController->image()->create(['url' => $path]);
        }

        return redirect()->route('raid-controllers.index');
    }

    public function edit(RaidController $raidController) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $raidController->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('RaidControllers/Edit', [
            'raidController' => $raidController,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Raid Controller
    public function update(Request $request, RaidController $raidController) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'model' => 'nullable|string|max:255',
            'supported_levels' => 'nullable|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Raid Controller model with the validated data
        $raidController->update([
            'name' => $validated['name'],
            'price' => $validated['price'] ?? $raidController->price,
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $raidController->model,
            'supported_levels' => $validated['supported_levels'] ?? $raidController->supported_levels,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $raidController->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($raidController->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($raidController->image->url);
                // Delete the old image record
                $raidController->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('raid_controllers', 'public');

            // Create a new image record associated with the Raid Controller
            $raidController->image()->create(['url' => $path]);
        }

        // Redirect back to the Raid Controller index or show the updated Raid Controller
        return redirect()->route('raid-controllers.index');
    }

    public function show(RaidController $raidController) {
        // Load the related brand, image, and servers
        $raidController->load('brand', 'image', 'servers');

        // Pass the Raid Controller data to the Inertia view
        return Inertia::render('RaidControllers/Show', [
            'raidController' => $raidController,
        ]);
    }

    public function destroy(RaidController $raidController) {
        // Delete the related image if it exists
        if ($raidController->image) {
            Storage::disk('public')->delete($raidController->image->url);
            $raidController->image()->delete();
        }

        // Detach servers if any are attached
        $raidController->servers()->detach();

        // Delete the Raid Controller
        $raidController->delete();

        return redirect()->route('raid-controllers.index');
    }
}
