<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$courses = \App\Models\Course::all();
foreach ($courses as $c) {
    $name = strtolower($c->name);
    if (strpos($name, 'phd') !== false || strpos($name, 'ph.d') !== false || strpos($name, 'doctor') !== false) {
        $c->type = 'phd';
    } elseif (strpos($name, 'msc') !== false || strpos($name, 'ma') !== false || strpos($name, 'm.sc') !== false || strpos($name, 'master') !== false) {
        $c->type = 'pg';
    } elseif (strpos($name, 'add-on') !== false || strpos($name, 'addon') !== false || strpos($name, 'certificate') !== false || strpos($name, 'diploma') !== false || strpos($name, 'vocational') !== false || strpos($name, 'value added') !== false) {
        $c->type = 'addon';
    } else {
        $c->type = 'ug';
    }
    $c->save();
    echo "Updated Course {$c->id}: {$c->name} -> Type: {$c->type}\n";
}
