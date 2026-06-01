<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "--- 1. WEBSITE SETTINGS (Payment & OTP Configuration) ---\n";
$settings = DB::table('website_settings')->get();
foreach ($settings as $setting) {
    // Only display dynamic settings relating to payments or OTPs
    if (str_contains($setting->key, 'razorpay') || str_contains($setting->key, 'otp') || str_contains($setting->key, 'payment')) {
        echo "Key: {$setting->key} => Value: {$setting->value}\n";
    }
}

echo "\n--- 2. PAGE CONTENTS (Page Control Manager sections) ---\n";
$contents = DB::table('page_contents')->select('id', 'page', 'section', 'created_at')->get();
if (count($contents) === 0) {
    echo "No custom page content overrides saved yet. Using defaults.\n";
} else {
    foreach ($contents as $c) {
        echo "Page: {$c->page} | Section: {$c->section} (ID: {$c->id})\n";
    }
}

echo "\n--- 3. USER MANAGEMENT (Login Accounts Sample) ---\n";
$users = DB::table('users')->select('id', 'name', 'email', 'role', 'plain_password')->limit(5)->get();
foreach ($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Email: {$u->email} | Role: {$u->role} | Password: {$u->plain_password}\n";
}
