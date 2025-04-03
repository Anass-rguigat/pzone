<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Server;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function index()
    {
        $discounts = Discount::has('servers')->get();

        return Inertia::render('Discounts/Index', [
            'discounts' => $discounts
        ]);
    }

    public function create()
    {
        $servers = Server::all();

        return Inertia::render('Discounts/Create', [
            'servers' => $servers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'required|date|after:start_date',
            'server_id' => 'nullable|exists:servers,id', 
        ]);

        if ($request->server_id) {
            $server = Server::findOrFail($request->server_id);

            $existingDiscount = $server->discounts()->where('end_date', '>', Carbon::now())->first();
            if ($existingDiscount) {
                return redirect()->route('discounts.create')->with('error', 'This server already has an active discount.');
            }
        }

        $discount = Discount::create([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? Carbon::now(),
            'end_date' => $request->end_date,
        ]);

        if ($request->server_id) {
            $server = Server::findOrFail($request->server_id);
            $server->discounts()->attach($discount);
            $this->updateServerPrice($server, $discount);
        }

        return redirect()->route('discounts.index')->with('success', 'Discount created successfully');
    }

    public function show(Discount $discount)
    {
        return view('discounts.show', compact('discount'));
    }

    public function edit(Discount $discount)
    {
        $servers = Server::all();
        $associatedServers = $discount->servers;

        return Inertia::render('Discounts/Edit', [
            'discount' => $discount,
            'servers' => $servers,
            'associatedServers' => $associatedServers
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'required|date|after:start_date',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
        ]);

        foreach ($discount->servers as $server) {
            $this->revertServerPrice($server, $discount);
        }

        $discount->update([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? $discount->start_date, 
            'end_date' => $request->end_date,
        ]);

        $discount->servers()->sync($request->input('server_ids', []));

        $discount->load('servers');

        foreach ($discount->servers as $server) {
            $this->updateServerPrice($server, $discount);
        }

        return redirect()->route('discounts.index')->with('success', 'Discount updated successfully');
    }

    public function destroy(Discount $discount)
    {
        foreach ($discount->servers as $server) {
            $this->revertServerPrice($server, $discount);
        }

        $discount->servers()->detach();

        $discount->delete();

        return redirect()->route('discounts.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    protected function updateServerPrice(Server $server, Discount $discount)
    {
        $originalPrice = $server->price;
        $newPrice = $originalPrice;

        if ($discount->discount_type === 'percentage') {
            $newPrice -= ($originalPrice * ($discount->value / 100));
        } elseif ($discount->discount_type === 'fixed') {
            $newPrice -= $discount->value;
        }

        $server->price = max($newPrice, 0);
        $server->save();
    }

    protected function revertServerPrice(Server $server, Discount $discount)
    {
        $currentPrice = $server->price;
        $originalPrice = $currentPrice;

        if ($discount->discount_type === 'percentage') {
            $originalPrice = $currentPrice / (1 - $discount->value / 100);
        } elseif ($discount->discount_type === 'fixed') {
            $originalPrice = $currentPrice + $discount->value;
        }

        $server->price = max($originalPrice, 0); 
        $server->save();
    }

    public function deleteExpiredDiscounts()
    {
        $expiredDiscounts = Discount::where('end_date', '<', Carbon::now())->get();

        foreach ($expiredDiscounts as $discount) {
            $discount->servers()->each(function ($server) use ($discount) {
                $this->revertServerPrice($server, $discount);

                $server->discounts()->detach($discount->id);
            });

            $discount->delete();
        }

        return response()->json(['message' => 'Expired discounts have been deleted and server prices restored.'], 200);
    }
}
