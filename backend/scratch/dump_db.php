<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- COURSES ---\n";
$courses = \App\Models\Course::all();
foreach ($courses as $c) {
    echo "ID: {$c->id} | Name: {$c->name} | Code: {$c->code}\n";
}

echo "\n--- FEE STRUCTURES ---\n";
$fees = \Illuminate\Support\Facades\DB::table('fee_structures')->get();
foreach ($fees as $f) {
    echo "ID: {$f->id} | Course Name: {$f->course_name} | Total Fee: {$f->total_fee}\n";
}
