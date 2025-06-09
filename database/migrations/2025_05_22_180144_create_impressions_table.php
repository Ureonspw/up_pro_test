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
        Schema::create('impressions', function (Blueprint $table) {
            $table->id('id_impr');
            $table->string('titre', 50);
            $table->unsignedBigInteger('id_Type_ipres');
            $table->foreign('id_Type_ipres')->references('id_Type_ipres')->on('type_impressions')->onDelete('cascade');
            $table->unsignedBigInteger('id_ia');
            $table->foreign('id_ia')->references('id_ia')->on('ias')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('impressions');
    }
};
