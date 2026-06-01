<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'pdf_path',
        'category',
        'is_important',
    ];

    protected $casts = [
        'is_important' => 'boolean',
    ];
}
