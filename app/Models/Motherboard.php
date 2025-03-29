<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Motherboard extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'model',
        'cpu_socket',
        'price',
        'chipset',
        'ram_slots',
        'pci_slots',
        'form_factor',
        'brand_id',
    ];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }
    
    public function image(): MorphOne {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function servers() {
        return $this->belongsToMany(Server::class, 'servers_components');
    }

    public function discounts() {
        return $this->belongsToMany(Discount::class, 'discount_component');
    }
}
