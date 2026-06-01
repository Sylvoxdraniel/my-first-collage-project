<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    protected $fillable = [
        'course_name',
        'tuition_fee',
        'lab_charges',
        'total_fee',
        'year'
    ];
}
