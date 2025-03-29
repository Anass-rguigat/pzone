<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Ram extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_id',
        'price',
        'capacity',
        'type',
        'speed',
    ];

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function image(): MorphOne {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function servers()
    {
        return $this->belongsToMany(Server::class, 'servers_components');
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_component');
    }
}

