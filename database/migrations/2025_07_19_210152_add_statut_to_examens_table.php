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
        Schema::table('examens', function (Blueprint $table) {
            $table->enum('statut', ['en_attente', 'questions_generees', 'actif', 'inactif'])->default('en_attente')->after('est_actif');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('examens', function (Blueprint $table) {
            $table->dropColumn('statut');
        });
    }
};
