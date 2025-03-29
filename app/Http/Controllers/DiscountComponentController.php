<?php

namespace App\Http\Controllers;

use App\Models\Chassis;
use App\Models\CoolingSolution;
use App\Models\Discount;
use App\Models\ExpansionCard;
use App\Models\FiberOpticCard;
use App\Models\GraphicCard;
use App\Models\HardDrive;
use App\Models\Motherboard;
use App\Models\NetworkCard;
use App\Models\PowerSupply;
use App\Models\Processor;
use App\Models\RaidController;
use App\Models\Ram;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountComponentController extends Controller
{
    /**
     * Display a listing of the discounts.
     */
    public function index()
    {
        // Retrieve all discounts that are applied to RAM (doesn't have servers)
        $discounts = Discount::doesntHave('servers')->get();

        return Inertia::render('DiscountComponents/Index', [
            'discounts' => $discounts
        ]);
    }

    /**
     * Show the form for creating a new discount.
     */
    public function create()
{
    // Get all components for selection
    $rams = Ram::all();
    $hardDrives = HardDrive::all();
    $processors = Processor::all();
    $powerSupplies = PowerSupply::all();
    $motherboards = Motherboard::all();
    $networkCards = NetworkCard::all();
    $raidControllers = RaidController::all();
    $coolingSolutions = CoolingSolution::all();
    $chassis = Chassis::all();
    $graphicCards = GraphicCard::all();
    $fiberOpticCards = FiberOpticCard::all();
    $expansionCards = ExpansionCard::all();

    return Inertia::render('DiscountComponents/Create', [
        'rams' => $rams,
        'hard_drives' => $hardDrives,
        'processors' => $processors,
        'power_supplies' => $powerSupplies,
        'motherboards' => $motherboards,
        'network_cards' => $networkCards,
        'raid_controllers' => $raidControllers,
        'cooling_solutions' => $coolingSolutions,
        'chassis' => $chassis,
        'graphic_cards' => $graphicCards,
        'fiber_optic_cards' => $fiberOpticCards,
        'expansion_cards' => $expansionCards,
    ]);
}



    


public function edit($id)
{
    // Find the discount component by ID and eager load related components
    $discount = Discount::with([
        'rams', 
        'hardDrives', 
        'processors', 
        'powerSupplies', 
        'motherboards', 
        'networkCards', 
        'raidControllers', 
        'coolingSolutions', 
        'chassis', 
        'graphicCards', 
        'fiberOpticCards', 
        'expansionCards'
    ])->findOrFail($id);

    

    // Prepare other component data
    $rams = Ram::all();
    $hardDrives = HardDrive::all();
    $processors = Processor::all();
    $powerSupplies = PowerSupply::all();
    $motherboards = Motherboard::all();
    $networkCards = NetworkCard::all();
    $raidControllers = RaidController::all();
    $coolingSolutions = CoolingSolution::all();
    $chassis = Chassis::all();
    $graphicCards = GraphicCard::all();
    $fiberOpticCards = FiberOpticCard::all();
    $expansionCards = ExpansionCard::all();

    // Return the Inertia view with the loaded data
    return Inertia::render('DiscountComponents/Edit', [
        'discount' => $discount,
        'rams' => $rams,
        'hard_drives' => $hardDrives,
        'processors' => $processors,
        'power_supplies' => $powerSupplies,
        'motherboards' => $motherboards,
        'network_cards' => $networkCards,
        'raid_controllers' => $raidControllers,
        'cooling_solutions' => $coolingSolutions,
        'chassis' => $chassis,
        'graphic_cards' => $graphicCards,
        'fiber_optic_cards' => $fiberOpticCards,
        'expansion_cards' => $expansionCards,
    ]);
}

    /**
     * Store a newly created discount in storage and apply it to a RAM.
     */
    

    /**
     * Display the specified discount.
     */
    public function show(Discount $discount)
    {
        return view('DiscountComponents.show', compact('discount'));
    }

    /**
     * Show the form for editing the specified discount.
     */
    
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
            'ram_ids' => 'nullable|array',
            'ram_ids.*' => 'exists:rams,id',
        ]);

        foreach ($discount->rams as $ram) {
            $this->revertRamPrice($ram, $discount);
        }

        // Update the discount
        $discount->update([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? Carbon::now(),
            'end_date' => $request->end_date,
        ]);

        // Detach any RAMs that are not part of the updated selection
        if ($request->has('ram_ids')) {
            $discount->rams()->sync($request->ram_ids);
        }

        // Update the RAM prices based on the new discount
        foreach ($discount->rams as $ram) {
            $this->updateComponentPrice($ram, $discount);
        }

        return redirect()->route('discountComponents.index')->with('success', 'Discount updated successfully');
    }

    /**
     * Remove the specified discount from storage.
     */
    public function destroy(Discount $discount)
    {
        // Revert RAM prices back to original value for each associated RAM
        foreach ($discount->rams as $ram) {
            $this->revertRamPrice($ram, $discount);
        }

        // Detach all associated RAMs from the discount
        $discount->rams()->detach();

        // Delete the discount
        $discount->delete();

        return redirect()->route('discountComponents.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    /**
     * Update the RAM price based on the applied discount.
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'required|date|after:start_date',
            'components' => 'nullable|array',
            'components.*.ram_id' => 'nullable|exists:rams,id',
            'components.*.processor_id' => 'nullable|exists:processors,id',
            'components.*.motherboard_id' => 'nullable|exists:motherboards,id',
            'components.*.raid_controller_id' => 'nullable|exists:raid_controllers,id',
            'components.*.chassi_id' => 'nullable|exists:chassis,id',
            'components.*.fiber_optic_card_id' => 'nullable|exists:fiber_optic_cards,id',
            'components.*.hard_drive_id' => 'nullable|exists:hard_drives,id',
            'components.*.network_card_id' => 'nullable|exists:network_cards,id',
            'components.*.power_supplie_id' => 'nullable|exists:power_supplies,id',
            'components.*.cooling_solution_id' => 'nullable|exists:cooling_solutions,id',
            'components.*.graphic_card_id' => 'nullable|exists:graphic_cards,id',
            'components.*.expansion_card_id' => 'nullable|exists:expansion_cards,id',
        ]);
        
        // Create the discount record
        $discount = Discount::create([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? Carbon::now(),
            'end_date' => $request->end_date,
        ]);
        // Apply the discount to the selected components
        $this->applyDiscountToComponents($request, $discount);
        
        return redirect()->route('discountComponents.index')->with('success', 'Discount created successfully');
    }

    /**
     * Apply the discount to the selected components.
     */
    protected function applyDiscountToComponents($request, Discount $discount)
{
    // Check if components are provided
    if ($request->components) {
        // Loop through all components and apply the discount
        foreach ($request->components as $component) {
            // Apply discount based on each component's ID (e.g., RAM, Processor)
            if (isset($component['ram_id'])) {
                // Find the RAM by ID and attach the discount
                try {
                    $ram = Ram::findOrFail($component['ram_id']);
                    $ram->discounts()->attach($discount);
                    $this->updateComponentPrice($ram, $discount); // Using the generic method
                } catch (\Exception $e) {
                    dd('Error applying discount to RAM', $e->getMessage());
                }
            }

            if (isset($component['processor_id'])) {
                // Apply discount to Processor
                try {
                    $processor = Processor::findOrFail($component['processor_id']);
                    $processor->discounts()->attach($discount);
                    $this->updateComponentPrice($processor, $discount); // Using the generic method
                } catch (\Exception $e) {
                    dd('Error applying discount to Processor', $e->getMessage());
                }
            }

            if (isset($component['motherboard_id'])) {
                
                try {
                    $motherboards = Motherboard::findOrFail($component['motherboard_id']);
                    $motherboards->discounts()->attach($discount);
                    $this->updateComponentPrice($motherboards, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to motherboard', $e->getMessage());
                }
            }

            if (isset($component['raid_controller_id'])) {
                
                try {
                    $raid_controller = RaidController::findOrFail($component['raid_controller_id']);
                    $raid_controller->discounts()->attach($discount);
                    $this->updateComponentPrice($raid_controller, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to raid controller', $e->getMessage());
                }
            }

            if (isset($component['chassi_id'])) {
                
                try {
                    $chassis = Chassis::findOrFail($component['chassi_id']);
                    $chassis->discounts()->attach($discount);
                    $this->updateComponentPrice($chassis, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to chassis', $e->getMessage());
                }
            }

            if (isset($component['fiber_optic_card_id'])) {
                
                try {
                    $fiber_optic_card = FiberOpticCard::findOrFail($component['fiber_optic_card_id']);
                    $fiber_optic_card->discounts()->attach($discount);
                    $this->updateComponentPrice($fiber_optic_card, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to fiber optic card', $e->getMessage());
                }
            }

            if (isset($component['hard_drive_id'])) {
                
                try {
                    $hard_drive = HardDrive::findOrFail($component['hard_drive_id']);
                    $hard_drive->discounts()->attach($discount);
                    $this->updateComponentPrice($hard_drive, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to hard drive', $e->getMessage());
                }
            }

            if (isset($component['network_card_id'])) {
                
                try {
                    $network_card = NetworkCard::findOrFail($component['network_card_id']);
                    $network_card->discounts()->attach($discount);
                    $this->updateComponentPrice($network_card, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to network card', $e->getMessage());
                }
            }

            if (isset($component['power_supplie_id'])) {
                
                try {
                    $power_supplie = PowerSupply::findOrFail($component['power_supplie_id']);
                    $power_supplie->discounts()->attach($discount);
                    $this->updateComponentPrice($power_supplie, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to power_supplie ', $e->getMessage());
                }
            }

            if (isset($component['cooling_solution_id'])) {
                
                try {
                    $cooling_solution = CoolingSolution::findOrFail($component['cooling_solution_id']);
                    $cooling_solution->discounts()->attach($discount);
                    $this->updateComponentPrice($cooling_solution, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to cooling_solution', $e->getMessage());
                }
            }

            if (isset($component['graphic_card_id'])) {
                
                try {
                    $graphic_card = GraphicCard::findOrFail($component['graphic_card_id']);
                    $graphic_card->discounts()->attach($discount);
                    $this->updateComponentPrice($graphic_card, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to graphic_card', $e->getMessage());
                }
            }

            if (isset($component['expansion_card_id'])) {
                
                try {
                    $expansion_card = ExpansionCard::findOrFail($component['expansion_card_id']);
                    $expansion_card->discounts()->attach($discount);
                    $this->updateComponentPrice($expansion_card, $discount); 
                } catch (\Exception $e) {
                    dd('Error applying discount to expansion_card', $e->getMessage());
                }
            }
            
        }
    } else {
        dd('No components provided in the request.');
    }
}


/**
 * Update the price of the Processor after applying the discount.
 */
            protected function updateProcessorPrice(Processor $processor, Discount $discount)
            {
                $originalPrice = $processor->price;
                $newPrice = $originalPrice;

                // Apply the discount based on the type
                if ($discount->discount_type === 'percentage') {
                    $newPrice -= ($originalPrice * ($discount->value / 100));
                } elseif ($discount->discount_type === 'fixed') {
                    $newPrice -= $discount->value;
                }

                // Ensure the price does not go below zero
                $processor->price = max($newPrice, 0);
                $processor->save();
            }


    /**
     * Update the price of the RAM after applying the discount.
     */
    /**
 * Update the price of the component after applying the discount.
 */
protected function updateComponentPrice($component, Discount $discount)
{
    $originalPrice = $component->price;
    $newPrice = $originalPrice;

    // Apply the discount based on the type
    if ($discount->discount_type === 'percentage') {
        $newPrice -= ($originalPrice * ($discount->value / 100));
    } elseif ($discount->discount_type === 'fixed') {
        $newPrice -= $discount->value;
    }

    // Ensure the price does not go below zero
    $component->price = max($newPrice, 0);
    $component->save();
}


    /**
     * Revert the RAM price to its original value when the discount is deleted.
     */
    protected function revertRamPrice(Ram $ram, Discount $discount)
    {
        $currentPrice = $ram->price;
        $originalPrice = $currentPrice;

        // Calculate the original price based on the discount type
        if ($discount->discount_type === 'percentage') {
            $originalPrice = $currentPrice / (1 - $discount->value / 100);
        } elseif ($discount->discount_type === 'fixed') {
            $originalPrice = $currentPrice + $discount->value;
        }

        // Ensure the original price does not go below zero
        $ram->price = max($originalPrice, 0);
        $ram->save();
    }

    /**
     * Automatically delete expired discounts and restore RAM's original price.
     */
    public function deleteExpiredDiscounts()
    {
        $expiredDiscounts = Discount::where('end_date', '<', Carbon::now())->get();

        foreach ($expiredDiscounts as $discount) {
            $discount->rams()->each(function ($ram) use ($discount) {
                // Restore the RAM price
                $this->revertRamPrice($ram, $discount);
                // Detach the discount from RAM
                $ram->discounts()->detach($discount->id);
            });

            // Delete the expired discount
            $discount->delete();
        }

        return response()->json(['message' => 'Expired discounts have been deleted and RAM prices restored.'], 200);
    }
}
