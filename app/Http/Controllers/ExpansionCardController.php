<?php

namespace App\Http\Controllers;

use App\Models\ExpansionCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExpansionCardController extends Controller
{
    public function index()
    {
        $expansionCards = ExpansionCard::with(['brand', 'image', 'servers'])->get(); // Load related servers
        return Inertia::render('ExpansionCards/Index', ['expansionCards' => $expansionCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all(); // Get all Servers to attach
        return Inertia::render('ExpansionCards/Create', [
            'brands' => $brands,
            'servers' => $servers, // Pass servers to the view
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'interface_type' => 'required|string|max:255',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array', // Accept an array of Server IDs
            'server_ids.*' => 'exists:servers,id', // Ensure all Server IDs are valid
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the ExpansionCard record
        $expansionCard = ExpansionCard::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'interface_type' => $validated['interface_type'],
            'speed' => $validated['speed'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        // Attach the servers if provided
        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $expansionCard->servers()->attach($validated['server_ids']);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('expansion_cards', 'public');
            $expansionCard->image()->create(['url' => $path]);
        }

        return redirect()->route('expansion-cards.index');
    }

    public function edit(ExpansionCard $expansionCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $expansionCard->load('brand', 'image', 'servers'); // Load all related data
        return Inertia::render('ExpansionCards/Edit', [
            'expansionCard' => $expansionCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    // Update ExpansionCard
    public function update(Request $request, ExpansionCard $expansionCard)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'nullable|string|max:255',
            'interface_type' => 'nullable|string|max:255',
            'speed' => 'nullable|numeric|min:0',
            'power_rating' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Only validate image if provided
        ]);

        // Update the ExpansionCard model with the validated data
        $expansionCard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'] ?? $expansionCard->type,
            'interface_type' => $validated['interface_type'] ?? $expansionCard->interface_type,
            'speed' => $validated['speed'] ?? $expansionCard->speed,
            'power_rating' => $validated['power_rating'] ?? $expansionCard->power_rating,
            'price' => $validated['price'] ?? $expansionCard->price,
        ]);

        // Sync the servers if any server_ids are provided
        if (isset($validated['server_ids'])) {
            $expansionCard->servers()->sync($validated['server_ids']);
        }

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($expansionCard->image) {
                // Delete the old image from the storage
                Storage::disk('public')->delete($expansionCard->image->url);
                // Delete the old image record
                $expansionCard->image()->delete();
            }

            // Store the new image
            $path = $request->file('image')->store('expansion_cards', 'public');

            // Create a new image record associated with the ExpansionCard
            $expansionCard->image()->create(['url' => $path]);
        }

        // Redirect back to the ExpansionCard index or show the updated ExpansionCard
        return redirect()->route('expansion-cards.index');
    }

    public function show(ExpansionCard $expansionCard)
    {
        // Load the related brand, image, and servers
        $expansionCard->load('brand', 'image', 'servers');

        // Pass the ExpansionCard data to the Inertia view
        return Inertia::render('ExpansionCards/Show', [
            'expansionCard' => $expansionCard,
        ]);
    }

    public function destroy(ExpansionCard $expansionCard)
    {
        // Delete the related image if it exists
        if ($expansionCard->image) {
            Storage::disk('public')->delete($expansionCard->image->url);
            $expansionCard->image()->delete();
        }

        // Detach servers if any are attached
        $expansionCard->servers()->detach();

        // Delete the ExpansionCard
        $expansionCard->delete();

        return redirect()->route('expansion-cards.index');
    }
}
