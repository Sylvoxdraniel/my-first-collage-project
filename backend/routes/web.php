<?php

use Illuminate\Support\Facades\Route;

// Single catch-all route for all web page URLs (handles root and sub-segments)
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');