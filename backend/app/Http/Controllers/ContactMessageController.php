<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of messages (Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $messages = $query->orderBy('created_at', 'desc')->get();

        return response()->json($messages);
    }

    /**
     * Store a newly created contact message (Public).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $validated['status'] = 'pending';

        $msg = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Your message has been sent successfully. We will contact you soon!',
            'contact_message' => $msg,
        ], 201);
    }

    /**
     * Update the message status (Admin).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,read',
        ]);

        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'contact_message' => $message,
        ]);
    }

    /**
     * Remove the specified message (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }
}
