<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of the images (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query();

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        $images = $query->orderBy('created_at', 'desc')->get();

        return response()->json($images);
    }

    /**
     * Store a newly uploaded image (Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'required|string|in:campus,event,sports,cultural,faculty',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/gallery');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['image_path'] = '/uploads/gallery/' . $filename;
        }

        unset($validated['image']);

        $item = Gallery::create($validated);

        return response()->json([
            'message' => 'Image uploaded to gallery successfully.',
            'item' => $item,
        ], 201);
    }

    /**
     * Remove the image from gallery (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $item = Gallery::findOrFail($id);

        if ($item->image_path && file_exists(public_path($item->image_path))) {
            unlink(public_path($item->image_path));
        }

        $item->delete();

        return response()->json([
            'message' => 'Image deleted from gallery successfully.',
        ]);
    }
}
