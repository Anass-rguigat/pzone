<?php

namespace App\Http\Controllers;

use App\Models\FiberOpticCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FiberOpticCardController extends Controller {
    public function index() {
        $fiberOpticCards = FiberOpticCard::with(['brand', 'image', 'servers'])->get(); // Load related servers
        return Inertia::render('FiberOpticCards/Index', ['fiberOpticCards' => $fiberOpticCards]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('FiberOpticCards/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the FiberOpticCard record
        $fiberOpticCard = FiberOpticCard::create([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'],
            'brand_id' => $validated['brand_id'],
            'speed' => $validated['speed'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $fiberOpticCard->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('fiber_optic_cards', 'public');
            $fiberOpticCard->image()->create(['url' => $path]);
        }

        return redirect()->route('fiber-optic-cards.index');
    }

    public function edit(FiberOpticCard $fiberOpticCard) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $fiberOpticCard->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('FiberOpticCards/Edit', [
            'fiberOpticCard' => $fiberOpticCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update FiberOpticCard
    public function update(Request $request, FiberOpticCard $fiberOpticCard) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'nullable|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'nullable|numeric|min:0',
            'power_rating' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the FiberOpticCard model with the validated data
        $fiberOpticCard->update([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'] ?? $fiberOpticCard->fiber_type,
            'speed' => $validated['speed'] ?? $fiberOpticCard->speed,
            'power_rating' => $validated['power_rating'] ?? $fiberOpticCard->power_rating,
            'price' => $validated['price'] ?? $fiberOpticCard->price,
            'brand_id' => $validated['brand_id'],
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $fiberOpticCard->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($fiberOpticCard->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($fiberOpticCard->image->url);
                // Delete the old image record
                $fiberOpticCard->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('fiber_optic_cards', 'public');

            // Create a new image record associated with the FiberOpticCard
            $fiberOpticCard->image()->create(['url' => $path]);
        }

        // Redirect back to the FiberOpticCard index or show the updated FiberOpticCard
        return redirect()->route('fiber-optic-cards.index');
    }

    public function show(FiberOpticCard $fiberOpticCard) {
        // Load the related brand, image, and servers
        $fiberOpticCard->load('brand', 'image', 'servers');

        // Pass the FiberOpticCard data to the Inertia view
        return Inertia::render('FiberOpticCards/Show', [
            'fiberOpticCard' => $fiberOpticCard,
        ]);
    }

    public function destroy(FiberOpticCard $fiberOpticCard) {
        // Delete the related image if it exists
        if ($fiberOpticCard->image) {
            Storage::disk('public')->delete($fiberOpticCard->image->url);
            $fiberOpticCard->image()->delete();
        }

        // Detach servers if any are attached
        $fiberOpticCard->servers()->detach();

        // Delete the FiberOpticCard
        $fiberOpticCard->delete();

        return redirect()->route('fiber-optic-cards.index');
    }
}
