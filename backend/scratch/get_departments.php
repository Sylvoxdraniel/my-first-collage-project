<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$departments = \App\Models\Department::all();
foreach ($departments as $d) {
    echo "ID: {$d->id} | Name: {$d->name} | Code: {$d->code}\n";
}
