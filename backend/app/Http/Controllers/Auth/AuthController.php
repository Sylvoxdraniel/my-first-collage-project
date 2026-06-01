<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login and return a Sanctum token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $loginId = $request->email;
        $user = User::where('email', $loginId)
            ->orWhere('mobile_number', $loginId)
            ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Incorrect password. If you forgot your password, please use Forgot Password to reset it.'],
            ]);
        }

        // Revoke all existing tokens for security
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        // Load the appropriate relationship based on role
        if ($user->isStudent()) {
            $user->load('student.department');
        } elseif ($user->isFaculty()) {
            $user->load('faculty.department');
        }

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Handle user registration and return a Sanctum token.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
            'role' => ['sometimes', 'string', 'in:admin,faculty,student'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'plain_password' => $request->password,
            'role' => $request->role ?? 'student',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Revoke the current user's token (logout).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Return the currently authenticated user with related profile.
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isStudent()) {
            $user->load('student.department');
        } elseif ($user->isFaculty()) {
            $user->load('faculty.department');
        }

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * List all users (admin only).
     */
    public function listUsers(Request $request): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'plain_password', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    /**
     * Create a new user (admin only).
     */
    public function createUser(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Password::min(8)],
            'role' => ['required', 'string', 'in:faculty,student'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'plain_password' => $request->password,
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }

    /**
     * Delete a user (admin only). Cannot delete self.
     */
    public function deleteUser(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        // Revoke all tokens
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    /**
     * Send OTP for Forgot Password.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => ['required', 'string'],
            'method' => ['required', 'string', 'in:email,sms'],
        ]);

        $loginId = $request->login_id;
        $method = $request->method;

        // Check if method is enabled
        if ($method === 'sms') {
            $smsEnabled = WebsiteSetting::where('key', 'otp_sms_enabled')->value('value') ?? '0';
            if ($smsEnabled !== '1') {
                return response()->json([
                    'message' => 'SMS OTP service is currently disabled.'
                ], 422);
            }
        } else {
            $emailEnabled = WebsiteSetting::where('key', 'otp_email_enabled')->value('value') ?? '1';
            if ($emailEnabled !== '1') {
                return response()->json([
                    'message' => 'Email OTP service is currently disabled.'
                ], 422);
            }
        }

        $user = User::where('email', $loginId)
            ->orWhere('mobile_number', $loginId)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No user account found with the registered email or mobile number.'
            ], 404);
        }

        // Get dynamic configuration for OTP length and type
        $length = (int) (WebsiteSetting::where('key', 'otp_code_length')->value('value') ?? 6);
        $type = WebsiteSetting::where('key', 'otp_code_type')->value('value') ?? 'numeric';

        if ($type === 'alphanumeric') {
            // uppercase alphanumeric
            $otp = strtoupper(\Illuminate\Support\Str::random($length));
        } else {
            $otp = '';
            for ($i = 0; $i < $length; $i++) {
                $otp .= random_int(0, 9);
            }
        }

        // Store OTP in cache for 10 minutes
        Cache::put('otp_' . $user->id, $otp, now()->addMinutes(10));

        $testMode = WebsiteSetting::where('key', 'otp_test_mode')->value('value') ?? '1';

        // Send OTP based on method
        if ($method === 'sms') {
            if (!$user->mobile_number) {
                return response()->json([
                    'message' => 'No registered mobile number associated with this account.'
                ], 422);
            }

            $apiUrl = WebsiteSetting::where('key', 'otp_sms_api_url')->value('value');
            $apiKey = WebsiteSetting::where('key', 'otp_sms_api_key')->value('value');
            $senderId = WebsiteSetting::where('key', 'otp_sms_sender_id')->value('value');
            $templateId = WebsiteSetting::where('key', 'otp_sms_template_id')->value('value');
            $msgTemplate = WebsiteSetting::where('key', 'otp_sms_message_template')->value('value') ?? 'Dear student, your verification OTP is {#otp#}.';

            $message = str_replace('{#otp#}', $otp, $msgTemplate);

            // Print simulation log
            \Illuminate\Support\Facades\Log::info("Forgot Password OTP sent to {$user->mobile_number} (SMS): {$message} [Template ID: {$templateId}]");

            // If live mode, call actual SMS gateway API
            if ($testMode !== '1' && $apiUrl) {
                $url = str_replace(
                    ['{API_KEY}', '{SENDER_ID}', '{MOBILE}', '{MESSAGE}', '{TEMPLATE_ID}', '{OTP}'],
                    [urlencode($apiKey), urlencode($senderId), urlencode($user->mobile_number), urlencode($message), urlencode($templateId), urlencode($otp)],
                    $apiUrl
                );
                try {
                    Http::get($url);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("SMS Gateway Request Failed: " . $e->getMessage());
                }
            }

            $maskedTarget = substr($user->mobile_number, 0, 3) . '****' . substr($user->mobile_number, -3);
            $targetType = 'mobile number';
        } else {
            // Email OTP
            \Illuminate\Support\Facades\Log::info("Forgot Password OTP sent to {$user->email} (Email): Your OTP is {$otp}. It is valid for 10 minutes.");
            
            $parts = explode('@', $user->email);
            $maskedTarget = substr($parts[0], 0, 3) . '****@' . $parts[1];
            $targetType = 'email address';
        }

        return response()->json([
            'message' => "An OTP has been successfully sent to your registered {$targetType} ({$maskedTarget}).",
        ]);
    }

    /**
     * Verify OTP and reset password.
     */
    public function verifyOtpAndResetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => ['required', 'string'],
            'otp' => ['required', 'string'],
            'password' => ['required', 'string', Password::min(8)],
        ]);

        $loginId = $request->login_id;
        $otp = $request->otp;

        $user = User::where('email', $loginId)
            ->orWhere('mobile_number', $loginId)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $cachedOtp = Cache::get('otp_' . $user->id);

        if (!$cachedOtp || strcasecmp((string)$cachedOtp, (string)$otp) !== 0) {
            return response()->json([
                'message' => 'The provided OTP is invalid or has expired.'
            ], 422);
        }

        // Update password
        $user->password = $request->password;
        $user->plain_password = $request->password;
        $user->save();

        // Clear OTP cache
        Cache::forget('otp_' . $user->id);

        return response()->json([
            'message' => 'Your password has been successfully reset. You can now login with your new password.',
        ]);
    }

    /**
     * Update a user's details and password (admin only).
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', Password::min(8)],
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if (!empty($request->password)) {
            $userData['password'] = $request->password;
            $userData['plain_password'] = $request->password;
        }

        $user->update($userData);

        return response()->json([
            'message' => 'User credentials updated successfully.',
            'user' => $user,
        ]);
    }
}
