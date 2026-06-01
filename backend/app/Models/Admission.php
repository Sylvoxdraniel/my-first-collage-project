<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_name',
        'father_name',
        'mother_name',
        'email',
        'mobile_number',
        'gender',
        'dob',
        'address',
        'course_selection',
        'category',
        'aadhaar_number',
        'document_path',
        'status',
    ];
}
