<?php

// Include Laravel's autoloader and bootstrap the application to use DB connection
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$backupFile = __DIR__ . '/../database_backup.sql';
$handle = fopen($backupFile, 'w+');

if (!$handle) {
    die("Failed to create backup file.\n");
}

fwrite($handle, "-- College Management System Database Dump\n");
fwrite($handle, "-- Generated on " . date('Y-m-d H:i:s') . "\n\n");
fwrite($handle, "SET FOREIGN_KEY_CHECKS=0;\n\n");

// Get all tables
$tables = DB::select('SHOW TABLES');
$dbName = DB::getDatabaseName();
$tableKey = "Tables_in_" . $dbName;

foreach ($tables as $tableObj) {
    $tableName = $tableObj->$tableKey;
    
    // Write DROP TABLE statement
    fwrite($handle, "DROP TABLE IF EXISTS `{$tableName}`;\n");
    
    // Write SHOW CREATE TABLE statement
    $createResult = DB::select("SHOW CREATE TABLE `{$tableName}`");
    $createKey = "Create Table";
    $createStatement = $createResult[0]->$createKey;
    fwrite($handle, $createStatement . ";\n\n");
    
    // Write INSERT statements
    $rows = DB::table($tableName)->get()->toArray();
    if (count($rows) > 0) {
        fwrite($handle, "LOCK TABLES `{$tableName}` WRITE;\n");
        
        foreach ($rows as $row) {
            $rowArray = (array)$row;
            $keys = array_keys($rowArray);
            $escapedKeys = array_map(function($key) {
                return "`" . addslashes($key) . "`";
            }, $keys);
            
            $values = array_values($rowArray);
            $escapedValues = array_map(function($value) {
                if ($value === null) {
                    return "NULL";
                }
                return "'" . addslashes($value) . "'";
            }, $values);
            
            $insertSql = "INSERT INTO `{$tableName}` (" . implode(', ', $escapedKeys) . ") VALUES (" . implode(', ', $escapedValues) . ");\n";
            fwrite($handle, $insertSql);
        }
        
        fwrite($handle, "UNLOCK TABLES;\n\n");
    }
}

fwrite($handle, "SET FOREIGN_KEY_CHECKS=1;\n");
fclose($handle);

echo "Database successfully backed up to " . realpath($backupFile) . "\n";
