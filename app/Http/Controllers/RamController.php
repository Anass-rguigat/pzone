<?php

namespace App\Http\Controllers;

use App\Models\Ram;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RamController extends Controller
{
    public function index()
    {
        $rams = Ram::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Rams/Index', ['rams' => $rams]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Rams/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|in:ddr3,ddr4,ddr5',
            'speed' => 'required|integer|min:1',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
        ]);

        $ram = Ram::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
            'type' => $validated['type'],
            'speed' => $validated['speed'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $ram->servers()->attach($validated['server_ids']);
        }

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
        $ram->load('brand', 'image', 'servers');
        return Inertia::render('Rams/Edit', [
            'ram' => $ram,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Ram $ram)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'capacity' => 'nullable|integer|min:1',
            'type' => 'nullable|in:ddr3,ddr4,ddr5',
            'speed' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'nullable|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
        ]);

        $ram->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $ram->price,
            'capacity' => $validated['capacity'] ?? $ram->capacity,
            'type' => $validated['type'] ?? $ram->type,
            'speed' => $validated['speed'] ?? $ram->speed,
        ]);

        if (isset($validated['server_ids'])) {
            $ram->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($ram->image) {
                Storage::disk('public')->delete($ram->image->url);
                $ram->image()->delete();
            }

            $path = $request->file('image')->store('rams', 'public');

            $ram->image()->create(['url' => $path]);
        }

        return redirect()->route('rams.index');
    }




    public function show(Ram $ram)
    {
        $ram->load('brand', 'image', 'servers');

        return Inertia::render('Rams/Show', [
            'ram' => $ram,
        ]);
    }

    public function destroy(Ram $ram)
    {
        if ($ram->image) {
            Storage::disk('public')->delete($ram->image->url);
            $ram->image()->delete();
        }

        $ram->servers()->detach();

        $ram->delete();

        return redirect()->route('rams.index');
    }
}
