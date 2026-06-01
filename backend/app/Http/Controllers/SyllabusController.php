<?php

namespace App\Http\Controllers;

use App\Models\Syllabus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SyllabusController extends Controller
{
    /**
     * Display a listing of syllabus entries (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Syllabus::query();

        if ($request->has('course_name') && $request->input('course_name') !== 'all') {
            $query->where('course_name', $request->input('course_name'));
        }

        if ($request->has('semester') && $request->input('semester') !== 'all') {
            $query->where('semester', $request->input('semester'));
        }

        $syllabi = $query->orderBy('course_name', 'asc')->orderBy('semester', 'asc')->get();

        return response()->json($syllabi);
    }

    /**
     * Store a newly created syllabus (Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'semester' => 'required|integer|min:1|max:8',
            'pdf' => 'required|file|mimes:pdf|max:10240', // 10MB max PDF
        ]);

        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
            $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/syllabus');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            $file->move($destinationPath, $filename);
            $validated['pdf_path'] = '/uploads/syllabus/' . $filename;
        }

        unset($validated['pdf']);

        $syllabus = Syllabus::create($validated);

        return response()->json([
            'message' => 'Syllabus document uploaded successfully.',
            'syllabus' => $syllabus,
        ], 201);
    }

    /**
     * Remove the specified syllabus (Admin).
     */
    public function destroy(string $id): JsonResponse
    {
        $syllabus = Syllabus::findOrFail($id);

        if ($syllabus->pdf_path && file_exists(public_path($syllabus->pdf_path))) {
            unlink(public_path($syllabus->pdf_path));
        }

        $syllabus->delete();

        return response()->json([
            'message' => 'Syllabus deleted successfully.',
        ]);
    }
}
