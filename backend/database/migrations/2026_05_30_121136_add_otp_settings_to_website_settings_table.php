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
                'key' => 'otp_sms_enabled',
                'value' => '0',
                'type' => 'boolean'
            ],
            [
                'key' => 'otp_email_enabled',
                'value' => '1',
                'type' => 'boolean'
            ],
            [
                'key' => 'otp_sms_api_url',
                'value' => 'https://api.smsgateway.com/send?apikey={API_KEY}&mobile={MOBILE}&message={MESSAGE}&sender={SENDER_ID}&template_id={TEMPLATE_ID}',
                'type' => 'text'
            ],
            [
                'key' => 'otp_sms_api_key',
                'value' => 'MOCK_API_KEY_123',
                'type' => 'text'
            ],
            [
                'key' => 'otp_sms_sender_id',
                'value' => 'GBMCGY',
                'type' => 'text'
            ],
            [
                'key' => 'otp_sms_template_id',
                'value' => '1207161829102930192',
                'type' => 'text'
            ],
            [
                'key' => 'otp_sms_message_template',
                'value' => 'Dear student, your verification OTP is {#otp#}. Gautam Budha Mahila College, Gaya.',
                'type' => 'text'
            ],
            [
                'key' => 'otp_code_length',
                'value' => '6',
                'type' => 'text'
            ],
            [
                'key' => 'otp_code_type',
                'value' => 'numeric', // numeric or alphanumeric
                'type' => 'text'
            ],
            [
                'key' => 'otp_test_mode',
                'value' => '1', // 1 = Test mode (Log only), 0 = Live mode (Calls API)
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
            'otp_sms_enabled',
            'otp_email_enabled',
            'otp_sms_api_url',
            'otp_sms_api_key',
            'otp_sms_sender_id',
            'otp_sms_template_id',
            'otp_sms_message_template',
            'otp_code_length',
            'otp_code_type',
            'otp_test_mode'
        ];

        WebsiteSetting::whereIn('key', $keys)->delete();
    }
};
