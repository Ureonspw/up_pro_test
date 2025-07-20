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
        Schema::create('participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_etudiant')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('id_examen')->constrained('examens')->onDelete('cascade');
            $table->integer('score_obtenu')->default(0);
            $table->integer('score_total')->default(0);
            $table->timestamp('date_debut_examen')->nullable();
            $table->timestamp('date_fin_examen')->nullable();
            $table->enum('statut', ['en_cours', 'termine', 'expire'])->default('en_cours');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participations');
    }
};
