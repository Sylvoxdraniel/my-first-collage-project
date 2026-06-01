<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of events (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::query();

        if ($request->has('upcoming')) {
            $query->where('date', '>=', now()->toDateString());
        }

        $events = $query->orderBy('date', 'asc')->get();

        return response()->json($events);
    }

    /**
     * Store a newly created event (Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/events');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['image_path'] = '/uploads/events/' . $filename;
        }

        unset($validated['image']);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event scheduled successfully.',
            'event' => $event,
        ], 201);
    }

    /**
     * Display the specified event.
     */
    public function show(string $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        return response()->json($event);
    }

    /**
     * Update the specified event (Admin).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // Delete old file
            if ($event->image_path && file_exists(public_path($event->image_path))) {
                unlink(public_path($event->image_path));
            }

            $file = $request->file('image');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/events');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['image_path'] = '/uploads/events/' . $filename;
        }

        unset($validated['image']);

        $event->update($validated);

        return response()->json([
            'message' => 'Event details updated successfully.',
            'event' => $event,
        ]);
    }

    /**
     * Remove the specified event (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        if ($event->image_path && file_exists(public_path($event->image_path))) {
            unlink(public_path($event->image_path));
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully.',
        ]);
    }
}
