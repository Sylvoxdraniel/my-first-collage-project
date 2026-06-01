<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courses = \App\Models\Course::all();
foreach ($courses as $c) {
    echo "ID: {$c->id} | Name: {$c->name} | Code: {$c->code}\n";
}
