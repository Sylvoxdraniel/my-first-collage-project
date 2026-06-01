<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'head_id',
        'labs',
        'outcomes',
        'careers',
        'achievements',
        'activities',
    ];

    /**
     * Get the faculty member who heads this department.
     */
    public function head(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'head_id');
    }

    /**
     * Get all students in this department.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Get all faculty members in this department.
     */
    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class);
    }

    /**
     * Get all courses offered by this department.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
