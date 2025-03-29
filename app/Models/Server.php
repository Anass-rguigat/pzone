<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'brand_id', 
        'price', 
        'model', 
        'cpu_socket', 
        'ram_slots', 
        'storage_slots', 
        'power_supply_type', 
        'rack_mountable', 
        'form_factor'
    ];

    // Relation Many-to-Many avec les Rams
    public function rams()
    {
        return $this->belongsToMany(Ram::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Hard Drives
    public function hardDrives()
    {
        return $this->belongsToMany(HardDrive::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Processors
    public function processors()
    {
        return $this->belongsToMany(Processor::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Power Supplies
    public function powerSupplies()
    {
        return $this->belongsToMany(PowerSupply::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Motherboards
    public function motherboards()
    {
        return $this->belongsToMany(Motherboard::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Network Cards
    public function networkCards()
    {
        return $this->belongsToMany(NetworkCard::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Raid Controllers
    public function raidControllers()
    {
        return $this->belongsToMany(RaidController::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Cooling Solutions
    public function coolingSolutions()
    {
        return $this->belongsToMany(CoolingSolution::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Chassis
    public function chassis()
    {
        return $this->belongsToMany(Chassis::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Graphic Cards
    public function graphicCards()
    {
        return $this->belongsToMany(GraphicCard::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Fiber Optic Cards
    public function fiberOpticCards()
    {
        return $this->belongsToMany(FiberOpticCard::class, 'servers_components');
    }

    // Relation Many-to-Many avec les Expansion Cards
    public function expansionCards()
    {
        return $this->belongsToMany(ExpansionCard::class, 'servers_components');
    }

    // Relation avec la table Brand
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // Relation MorphOne avec l'image
    public function image(): MorphOne 
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    // Relation Many-to-Many avec les Discounts
    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_server');
    }   
}
