<?php
namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Server;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    /**
     * Display a listing of the discounts.
     */
    public function index()
{
    // Retrieve all discounts
    $discounts = Discount::has('servers')->get();

    // Return the Inertia view with the discounts data
    return Inertia::render('Discounts/Index', [
        'discounts' => $discounts
    ]);
}

    /**
     * Show the form for creating a new discount.
     */
    public function create()
    {
        // Get all servers for selection
        $servers = Server::all();

        return Inertia::render('Discounts/Create', [
            'servers' => $servers
        ]);
    }

    /**
     * Store a newly created discount in storage and apply it to a server.
     */
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'discount_type' => 'required|in:percentage,fixed',
        'value' => 'required|numeric|min:0',
        'start_date' => 'nullable|date',
        'end_date' => 'required|date|after:start_date',
        'server_id' => 'nullable|exists:servers,id', // Optional: apply discount to a server
    ]);

    // Check if the server already has an active discount
    if ($request->server_id) {
        $server = Server::findOrFail($request->server_id);

        // Check if the server already has an active discount (end_date > now)
        $existingDiscount = $server->discounts()->where('end_date', '>', Carbon::now())->first();
        if ($existingDiscount) {
            return redirect()->route('discounts.create')->with('error', 'This server already has an active discount.');
        }
    }

    // Create the discount with the start_date set to now if not provided
    $discount = Discount::create([
        'name' => $request->name,
        'discount_type' => $request->discount_type,
        'value' => $request->value,
        'start_date' => $request->start_date ?? Carbon::now(),
        'end_date' => $request->end_date,
    ]);

    // Apply the discount to the selected server (if any)
    if ($request->server_id) {
        $server = Server::findOrFail($request->server_id);
            $server->discounts()->attach($discount);
        // Update the server's price based on the discount
        $this->updateServerPrice($server, $discount);
    }

    return redirect()->route('discounts.index')->with('success', 'Discount created successfully');
}


    /**
     * Display the specified discount.
     */
    public function show(Discount $discount)
    {
        // Show the discount details along with associated servers if needed
        return view('discounts.show', compact('discount'));
    }

    /**
     * Show the form for editing the specified discount.
     */
    public function edit(Discount $discount)
    {
        // Get the servers associated with this discount
        $servers = Server::all();
        $associatedServers = $discount->servers;

        return Inertia::render('Discounts/Edit', [
            'discount' => $discount,
            'servers' => $servers,
            'associatedServers' => $associatedServers
        ]);
    }

    /**
     * Update the specified discount in storage.
     */
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

    // Revert the server prices before applying the new discount
    foreach ($discount->servers as $server) {
        $this->revertServerPrice($server, $discount);
    }

    // Update the discount
    $discount->update([
        'name' => $request->name,
        'discount_type' => $request->discount_type,
        'value' => $request->value,
        'start_date' => $request->start_date ?? Carbon::now(),
        'end_date' => $request->end_date,
    ]);

    // Detach any servers not included in the updated discount
    if ($request->has('server_ids')) {
        $discount->servers()->sync($request->server_ids);
    }

    // Optionally, update the server prices based on the new discount
    foreach ($discount->servers as $server) {
        $this->updateServerPrice($server, $discount);
    }

    return redirect()->route('discounts.index')->with('success', 'Discount updated successfully');
}


    /**
     * Remove the specified discount from storage.
     */
    public function destroy(Discount $discount)
    {
        // For each server that has this discount, revert the price back to its original value
        foreach ($discount->servers as $server) {
            $this->revertServerPrice($server, $discount);
        }

        // Detach all servers that have this discount
        $discount->servers()->detach();

        // Delete the discount
        $discount->delete();

        return redirect()->route('discounts.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    /**
     * Update the server's price based on the applied discount.
     */
    protected function updateServerPrice(Server $server, Discount $discount)
    {
        $originalPrice = $server->price;
        $newPrice = $originalPrice;

        // Apply the discount based on the discount type
        if ($discount->discount_type === 'percentage') {
            $newPrice -= ($originalPrice * ($discount->value / 100));
        } elseif ($discount->discount_type === 'fixed') {
            $newPrice -= $discount->value;
        }

        // Ensure the price does not go below 0
        $server->price = max($newPrice, 0);
        $server->save();
    }

    /**
     * Revert the server's price back to its original value when a discount is deleted.
     */
    protected function revertServerPrice(Server $server, Discount $discount)
{
    $currentPrice = $server->price;
    $originalPrice = $currentPrice;

    if ($discount->discount_type === 'percentage') {
        // Calculate the original price from the current price and discount percentage
        $originalPrice = $currentPrice / (1 - $discount->value / 100);
    } elseif ($discount->discount_type === 'fixed') {
        // Add the discount value back to the current price
        $originalPrice = $currentPrice + $discount->value;
    }

    // Set the server's price back to its original value
    $server->price = max($originalPrice, 0); // Ensure the price is non-negative
    $server->save();
}


    /**
     * Automatically delete expired discounts and restore the server's original price.
     */
    public function deleteExpiredDiscounts()
    {
        $expiredDiscounts = Discount::where('end_date', '<', Carbon::now())->get();

        foreach ($expiredDiscounts as $discount) {
            // Detach the discount from all associated servers
            $discount->servers()->each(function ($server) use ($discount) {
                // Restore the server's price after discount removal
                $this->revertServerPrice($server, $discount);

                // Detach the discount from the server
                $server->discounts()->detach($discount->id);
            });

            // Delete the expired discount
            $discount->delete();
        }

        return response()->json(['message' => 'Expired discounts have been deleted and server prices restored.'], 200);
    }
}


