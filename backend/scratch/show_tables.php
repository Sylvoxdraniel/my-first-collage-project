<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select('SHOW TABLES');
$dbName = DB::getDatabaseName();
$tableKey = "Tables_in_" . $dbName;

echo "Database Name: " . $dbName . "\n";
echo "============================\n";

foreach ($tables as $index => $tableObj) {
    $tableName = $tableObj->$tableKey;
    echo ($index + 1) . ". " . $tableName . "\n";
}
