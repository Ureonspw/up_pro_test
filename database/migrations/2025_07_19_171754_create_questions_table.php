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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->enum('type', ['choix_multiple', 'choix_unique', 'vrai_faux']);
            $table->integer('points')->default(1);
            $table->foreignId('id_examen')->constrained('examens')->onDelete('cascade');
            $table->integer('ordre')->default(0);
            $table->boolean('est_modifiee_manuellement')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
