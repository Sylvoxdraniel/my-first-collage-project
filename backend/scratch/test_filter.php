<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$dbCourses = \App\Models\Course::all()->toArray();
$feeStructures = \Illuminate\Support\Facades\DB::table('fee_structures')->get()->toArray();

function getCourseTab($course) {
    $name = strtolower($course['name']);
    if (strpos($name, 'phd') !== false || strpos($name, 'ph.d') !== false || strpos($name, 'doctor') !== false) {
        return 'phd';
    }
    if (strpos($name, 'msc') !== false || strpos($name, 'ma') !== false || strpos($name, 'm.sc') !== false || strpos($name, 'master') !== false) {
        return 'pg';
    }
    return 'ug';
}

$tabs = ['ug', 'pg', 'phd'];
foreach ($tabs as $activeTab) {
    echo "=== TAB: {$activeTab} ===\n";
    $filteredDb = array_filter($dbCourses, function($c) use ($activeTab) {
        return getCourseTab($c) === $activeTab;
    });

    // filter by fee structures
    $filteredByFees = array_filter($filteredDb, function($c) use ($feeStructures) {
        foreach ($feeStructures as $f) {
            $f_name = strtolower($f->course_name);
            $c_name = strtolower($c['name']);
            if ($f_name === $c_name || strpos($c_name, $f_name) !== false || strpos($f_name, $c_name) !== false) {
                return true;
            }
        }
        return false;
    });

    foreach ($filteredByFees as $c) {
        echo " - Name: {$c['name']} (Code: {$c['code']})\n";
    }
}
