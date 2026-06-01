<?php

namespace App\Http\Controllers;

use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Create a new Razorpay Order.
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'receipt' => ['required', 'string'],
        ]);

        $amount = (float) $request->amount;
        $receipt = $request->receipt;

        // Fetch Razorpay credentials
        $keyId = WebsiteSetting::where('key', 'razorpay_key_id')->value('value');
        $keySecret = WebsiteSetting::where('key', 'razorpay_key_secret')->value('value');
        $enabled = WebsiteSetting::where('key', 'razorpay_enabled')->value('value') ?? '0';

        if ($enabled !== '1') {
            return response()->json([
                'error' => 'Razorpay Payment Gateway is currently disabled.'
            ], 422);
        }

        // Razorpay expects amount in paise (1 INR = 100 paise)
        $amountInPaise = (int) ($amount * 100);

        try {
            $response = Http::withBasicAuth($keyId, $keySecret)
                ->post('https://api.razorpay.com/v1/orders', [
                    'amount' => $amountInPaise,
                    'currency' => 'INR',
                    'receipt' => $receipt,
                ]);

            if ($response->failed()) {
                Log::error("Razorpay Order Creation Failed: " . $response->body());
                return response()->json([
                    'error' => 'Failed to initialize payment with Razorpay.',
                    'details' => $response->json()
                ], 500);
            }

            $order = $response->json();

            return response()->json([
                'order_id' => $order['id'],
                'amount' => $order['amount'],
                'currency' => $order['currency'],
                'key_id' => $keyId,
            ]);

        } catch (\Exception $e) {
            Log::error("Razorpay Gateway Exception: " . $e->getMessage());
            return response()->json([
                'error' => 'An unexpected error occurred while contacting Razorpay.'
            ], 500);
        }
    }

    /**
     * Verify Razorpay Payment Signature.
     */
    public function verifyRazorpaySignature(Request $request): JsonResponse
    {
        $request->validate([
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        $paymentId = $request->razorpay_payment_id;
        $orderId = $request->razorpay_order_id;
        $signature = $request->razorpay_signature;

        // Fetch secret key to verify
        $keySecret = WebsiteSetting::where('key', 'razorpay_key_secret')->value('value');

        // Verify HMAC-SHA256 signature
        $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);

        if (hash_equals($expectedSignature, $signature)) {
            return response()->json([
                'message' => 'Payment signature verified successfully.',
                'verified' => true
            ]);
        }

        return response()->json([
            'error' => 'Payment verification failed. Invalid signature.',
            'verified' => false
        ], 400);
    }
}
