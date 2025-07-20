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
        Schema::create('reponses_etudiants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_participation')->constrained('participations')->onDelete('cascade');
            $table->foreignId('id_question')->constrained('questions')->onDelete('cascade');
            $table->foreignId('id_reponse')->nullable()->constrained('reponses')->onDelete('set null');
            $table->text('reponse_texte')->nullable();
            $table->boolean('est_correcte')->default(false);
            $table->integer('points_obtenus')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reponses_etudiants');
    }
};
