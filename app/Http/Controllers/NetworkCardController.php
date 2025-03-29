<?php

namespace App\Http\Controllers;

use App\Models\NetworkCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NetworkCardController extends Controller {
    public function index() {
        $networkCards = NetworkCard::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('NetworkCards/Index', ['networkCards' => $networkCards]);
    }

    public function create() {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('NetworkCards/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'nullable|numeric|min:0',
            'model' => 'required|string|max:255',
            'interface' => 'required|string|max:255',
            'speed' => 'required|integer|min:1',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the Network Card record
        $networkCard = NetworkCard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'interface' => $validated['interface'],
            'speed' => $validated['speed'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $networkCard->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('network_cards', 'public');
            $networkCard->image()->create(['url' => $path]);
        }

        return redirect()->route('network-cards.index');
    }

    public function edit(NetworkCard $networkCard) {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $networkCard->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('NetworkCards/Edit', [
            'networkCard' => $networkCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update Network Card
    public function update(Request $request, NetworkCard $networkCard) {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'interface' => 'nullable|string|max:255',
            'speed' => 'nullable|integer|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the Network Card model with the validated data
        $networkCard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $networkCard->price,
            'model' => $validated['model'] ?? $networkCard->model,
            'interface' => $validated['interface'] ?? $networkCard->interface,
            'speed' => $validated['speed'] ?? $networkCard->speed,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $networkCard->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($networkCard->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($networkCard->image->url);
                // Delete the old image record
                $networkCard->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('network_cards', 'public');

            // Create a new image record associated with the Network Card
            $networkCard->image()->create(['url' => $path]);
        }

        // Redirect back to the Network Card index or show the updated Network Card
        return redirect()->route('network-cards.index');
    }

    public function show(NetworkCard $networkCard) {
        // Load the related brand, image, and servers
        $networkCard->load('brand', 'image', 'servers');

        // Pass the Network Card data to the Inertia view
        return Inertia::render('NetworkCards/Show', [
            'networkCard' => $networkCard,
        ]);
    }

    public function destroy(NetworkCard $networkCard) {
        // Delete the related image if it exists
        if ($networkCard->image) {
            Storage::disk('public')->delete($networkCard->image->url);
            $networkCard->image()->delete();
        }

        // Detach servers if any are attached
        $networkCard->servers()->detach();

        // Delete the Network Card
        $networkCard->delete();

        return redirect()->route('network-cards.index');
    }
}
