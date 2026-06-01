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
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('employee_id')->unique();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->string('designation');
            $table->string('qualification')->nullable();
            $table->string('phone')->nullable();
            $table->date('joining_date');
            $table->string('avatar')->nullable();
            $table->timestamps();
        });

        // Now add the foreign key constraint for head_id in departments
        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('head_id')->references('id')->on('faculty')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['head_id']);
        });
        Schema::dropIfExists('faculty');
    }
};
