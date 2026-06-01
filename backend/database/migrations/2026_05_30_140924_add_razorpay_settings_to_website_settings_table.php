<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\WebsiteSetting;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settings = [
            [
                'key' => 'razorpay_enabled',
                'value' => '0', // Default: disabled, simulator is used
                'type' => 'boolean'
            ],
            [
                'key' => 'razorpay_key_id',
                'value' => 'rzp_test_MOCK_KEY_ID_123',
                'type' => 'text'
            ],
            [
                'key' => 'razorpay_key_secret',
                'value' => 'MOCK_SECRET_123',
                'type' => 'text'
            ],
            [
                'key' => 'razorpay_test_mode',
                'value' => '1', // 1 = Test mode, 0 = Live mode
                'type' => 'boolean'
            ]
        ];

        foreach ($settings as $setting) {
            WebsiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'type' => $setting['type']]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $keys = [
            'razorpay_enabled',
            'razorpay_key_id',
            'razorpay_key_secret',
            'razorpay_test_mode'
        ];

        WebsiteSetting::whereIn('key', $keys)->delete();
    }
};
