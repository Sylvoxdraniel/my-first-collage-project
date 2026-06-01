<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageSlider extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'caption',
        'description',
        'image_path',
        'button_text',
        'button_link',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
