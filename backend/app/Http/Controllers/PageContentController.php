<?php

namespace App\Http\Controllers;

use App\Models\PageContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageContentController extends Controller
{
    /**
     * Get all sections for a page (public).
     */
    public function index(string $page): JsonResponse
    {
        $contents = PageContent::where('page', $page)->get();

        // Return as section => content map
        $map = [];
        foreach ($contents as $item) {
            $map[$item->section] = $item->content;
        }

        return response()->json($map);
    }

    /**
     * Upsert a section's content (admin only).
     */
    public function upsert(Request $request): JsonResponse
    {
        $request->validate([
            'page' => ['required', 'string', 'max:100'],
            'section' => ['required', 'string', 'max:100'],
            'content' => ['required', 'array'],
        ]);

        $record = PageContent::updateOrCreate(
            ['page' => $request->page, 'section' => $request->section],
            ['content' => $request->content]
        );

        return response()->json([
            'message' => 'Content updated successfully.',
            'data' => $record,
        ]);
    }

    /**
     * Upload an image for a page section (admin only).
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB max
            'page' => ['required', 'string'],
            'section' => ['required', 'string'],
        ]);

        $file = $request->file('image');
        $filename = 'page_' . $request->page . '_' . $request->section . '_' . time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/pages'), $filename);

        $imagePath = '/uploads/pages/' . $filename;

        // Update the section's content with the new image path
        $record = PageContent::where('page', $request->page)
            ->where('section', $request->section)
            ->first();

        if ($record) {
            $content = $record->content;
            $content['image'] = $imagePath;
            $record->update(['content' => $content]);
        } else {
            PageContent::create([
                'page' => $request->page,
                'section' => $request->section,
                'content' => ['image' => $imagePath],
            ]);
        }

        return response()->json([
            'message' => 'Image uploaded successfully.',
            'image_path' => $imagePath,
        ]);
    }
}
