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
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('father_name');
            $table->string('mother_name');
            $table->string('email');
            $table->string('mobile_number');
            $table->string('gender');
            $table->date('dob');
            $table->text('address');
            $table->string('course_selection');
            $table->string('category');
            $table->string('aadhaar_number');
            $table->string('document_path')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};
