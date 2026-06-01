<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    /**
     * Display listing of notices (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notice::query();

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        if ($request->has('is_important')) {
            $query->where('is_important', true);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $notices = $query->orderBy('created_at', 'desc')->get();

        return response()->json($notices);
    }

    /**
     * Store new notice (Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|in:general,academic,exam,admission',
            'is_important' => 'nullable|boolean',
            'pdf' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:10240', // 10MB max
        ]);

        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/notices');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['pdf_path'] = '/uploads/notices/' . $filename;
        }

        unset($validated['pdf']);
        $validated['is_important'] = $request->boolean('is_important', false);

        $notice = Notice::create($validated);

        return response()->json([
            'message' => 'Notice published successfully.',
            'notice' => $notice,
        ], 201);
    }

    /**
     * Display a specific notice.
     */
    public function show(string $id): JsonResponse
    {
        $notice = Notice::findOrFail($id);
        return response()->json($notice);
    }

    /**
     * Update a notice (Admin).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $notice = Notice::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|in:general,academic,exam,admission',
            'is_important' => 'nullable|boolean',
            'pdf' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:10240',
        ]);

        if ($request->hasFile('pdf')) {
            // Delete old file if exists
            if ($notice->pdf_path && file_exists(public_path($notice->pdf_path))) {
                unlink(public_path($notice->pdf_path));
            }

            $file = $request->file('pdf');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/notices');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['pdf_path'] = '/uploads/notices/' . $filename;
        }

        unset($validated['pdf']);
        $validated['is_important'] = $request->boolean('is_important', false);

        $notice->update($validated);

        return response()->json([
            'message' => 'Notice updated successfully.',
            'notice' => $notice,
        ]);
    }

    /**
     * Remove a notice (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $notice = Notice::findOrFail($id);

        if ($notice->pdf_path && file_exists(public_path($notice->pdf_path))) {
            unlink(public_path($notice->pdf_path));
        }

        $notice->delete();

        return response()->json([
            'message' => 'Notice deleted successfully.',
        ]);
    }
}
