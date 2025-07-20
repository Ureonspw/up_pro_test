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
        Schema::table('participations', function (Blueprint $table) {
            $table->string('nom_etudiant')->nullable()->after('id_etudiant');
            $table->string('email_etudiant')->nullable()->after('nom_etudiant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participations', function (Blueprint $table) {
            $table->dropColumn(['nom_etudiant', 'email_etudiant']);
        });
    }
};
