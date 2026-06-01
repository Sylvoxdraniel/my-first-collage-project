<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FeeStructure;
use Illuminate\Http\JsonResponse;

class FeeStructureController extends Controller
{
    /**
     * Display a listing of fee structures.
     */
    public function index(Request $request): JsonResponse
    {
        $query = FeeStructure::query();
        if ($request->has('year')) {
            $query->where('year', $request->input('year'));
        }
        $feeStructures = $query->orderBy('year', 'desc')->orderBy('course_name', 'asc')->get();
        return response()->json($feeStructures);
    }

    /**
     * Store a newly created fee structure.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'tuition_fee' => 'required|integer|min:0',
            'lab_charges' => 'required|integer|min:0',
            'year' => 'required|string|max:50',
        ]);

        $validated['total_fee'] = $validated['tuition_fee'] + $validated['lab_charges'];

        // Save or update existing
        $feeStructure = FeeStructure::updateOrCreate(
            ['course_name' => $validated['course_name'], 'year' => $validated['year']],
            $validated
        );

        return response()->json([
            'message' => 'Fee structure saved successfully!',
            'fee_structure' => $feeStructure
        ], 201);
    }

    /**
     * Update an existing fee structure.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $feeStructure = FeeStructure::findOrFail($id);

        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'tuition_fee' => 'required|integer|min:0',
            'lab_charges' => 'required|integer|min:0',
            'year' => 'required|string|max:50',
        ]);

        $validated['total_fee'] = $validated['tuition_fee'] + $validated['lab_charges'];

        $feeStructure->update($validated);

        return response()->json([
            'message' => 'Fee structure updated successfully!',
            'fee_structure' => $feeStructure
        ]);
    }

    /**
     * Delete an existing fee structure.
     */
    public function destroy(string $id): JsonResponse
    {
        $feeStructure = FeeStructure::findOrFail($id);
        $feeStructure->delete();

        return response()->json([
            'message' => 'Fee structure deleted successfully!'
        ]);
    }
}
