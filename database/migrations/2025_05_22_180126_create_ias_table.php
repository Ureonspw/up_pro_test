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
        Schema::create('ias', function (Blueprint $table) {
            $table->id('id_ia');
            $table->string('titre', 50);
            $table->string('contenue_ia', 8000);
            $table->unsignedBigInteger('ID_type_IA');
            $table->foreign('ID_type_IA')->references('id_type_IA')->on('type_ias')->onDelete('cascade');
            $table->unsignedBigInteger('id_doc');
            $table->foreign('id_doc')->references('id_doc')->on('documents')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ias');
    }
};
