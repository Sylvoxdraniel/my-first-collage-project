<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page');       // e.g. 'infrastructure', 'about'
            $table->string('section');    // e.g. 'classrooms', 'chairman'
            $table->json('content');      // { name, image, desc, highlights, ... }
            $table->timestamps();

            $table->unique(['page', 'section']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
