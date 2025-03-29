<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->string('model'); // Modèle du serveur
            $table->string('cpu_socket'); // Type de socket CPU
            $table->integer('ram_slots'); // Nombre de slots RAM
            $table->integer('storage_slots'); // Nombre de slots de stockage
            $table->string('power_supply_type'); // Type d'alimentation
            $table->boolean('rack_mountable'); // Serveur montable en rack (true/false)
            $table->string('form_factor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers');
    }
};
