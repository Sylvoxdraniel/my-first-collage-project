<?php

namespace App\Http\Controllers;

use App\Models\WebsiteSetting;
use App\Models\HomepageSlider;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteControlController extends Controller
{
    /**
     * Public bootstrap endpoint returning settings, sliders, and announcements.
     */
    public function publicBootstrap(): JsonResponse
    {
        $settings = WebsiteSetting::pluck('value', 'key');
        $sliders = HomepageSlider::where('is_active', true)->orderBy('sort_order')->get();
        $announcements = Announcement::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'settings' => $settings,
            'sliders' => $sliders,
            'announcements' => $announcements
        ]);
    }

    /**
     * Update website settings in bulk.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $settings = $request->all();
        
        foreach ($settings as $key => $value) {
            $setting = WebsiteSetting::where('key', $key)->first();
            if ($setting) {
                // Keep type, update value
                $setting->update(['value' => $value]);
            }
        }

        $allSettings = WebsiteSetting::pluck('value', 'key');
        return response()->json([
            'message' => 'Settings updated successfully.',
            'settings' => $allSettings
        ]);
    }

    /**
     * Upload and update website logo.
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/logo');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            $logoPath = '/uploads/logo/' . $filename;

            // Delete old logo file if it exists and is local
            $oldLogoSetting = WebsiteSetting::where('key', 'logo_path')->first();
            if ($oldLogoSetting && $oldLogoSetting->value) {
                $oldPath = public_path($oldLogoSetting->value);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            WebsiteSetting::updateOrCreate(
                ['key' => 'logo_path'],
                ['value' => $logoPath, 'type' => 'image']
            );

            return response()->json([
                'message' => 'Logo uploaded successfully.',
                'logo_path' => $logoPath
            ]);
        }

        return response()->json(['message' => 'No file uploaded.'], 400);
    }

    /**
     * Upload and update website affiliation logo.
     */
    public function uploadAffiliationLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'mu_logo_' . time() . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/logo');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            $logoPath = '/uploads/logo/' . $filename;

            $oldLogoSetting = WebsiteSetting::where('key', 'affiliation_logo_path')->first();
            if ($oldLogoSetting && $oldLogoSetting->value) {
                $oldPath = public_path($oldLogoSetting->value);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            WebsiteSetting::updateOrCreate(
                ['key' => 'affiliation_logo_path'],
                ['value' => $logoPath, 'type' => 'image']
            );

            return response()->json([
                'message' => 'Affiliation Logo uploaded successfully.',
                'affiliation_logo_path' => $logoPath
            ]);
        }

        return response()->json(['message' => 'No file uploaded.'], 400);
    }

    /**
     * List all sliders (active & inactive) for Admin panel.
     */
    public function getSliders(): JsonResponse
    {
        $sliders = HomepageSlider::orderBy('sort_order')->get();
        return response()->json($sliders);
    }

    /**
     * Store new homepage slider.
     */
    public function storeSlider(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'slider_' . time() . '_' . rand(100, 999) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/sliders');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            $validated['image_path'] = '/uploads/sliders/' . $filename;
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = $request->input('sort_order', HomepageSlider::max('sort_order') + 1);

        unset($validated['image']);
        $slider = HomepageSlider::create($validated);

        return response()->json([
            'message' => 'Slider created successfully.',
            'slider' => $slider
        ], 201);
    }

    /**
     * Update an existing slider.
     */
    public function updateSlider(Request $request, string $id): JsonResponse
    {
        $slider = HomepageSlider::findOrFail($id);

        $rules = [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ];

        // Only validate fields present in the request
        $rulesToValidate = array_intersect_key($rules, $request->all());
        $validated = $request->validate($rulesToValidate);

        if ($request->hasFile('image')) {
            // Delete old image if it exists and is local
            if ($slider->image_path) {
                $oldPath = public_path($slider->image_path);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('image');
            $filename = 'slider_' . time() . '_' . rand(100, 999) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/sliders');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            $validated['image_path'] = '/uploads/sliders/' . $filename;
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }
        if ($request->has('sort_order')) {
            $validated['sort_order'] = intval($request->input('sort_order'));
        }

        unset($validated['image']);
        $slider->update($validated);

        return response()->json([
            'message' => 'Slider updated successfully.',
            'slider' => $slider
        ]);
    }

    /**
     * Delete slider.
     */
    public function destroySlider(string $id): JsonResponse
    {
        $slider = HomepageSlider::findOrFail($id);
        if ($slider->image_path) {
            $oldPath = public_path($slider->image_path);
            if (file_exists($oldPath) && is_file($oldPath)) {
                @unlink($oldPath);
            }
        }
        $slider->delete();

        return response()->json([
            'message' => 'Slider deleted successfully.'
        ]);
    }

    /**
     * Reorder sliders in bulk.
     */
    public function reorderSliders(Request $request): JsonResponse
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer|exists:homepage_sliders,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->input('orders') as $order) {
            HomepageSlider::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json([
            'message' => 'Sliders reordered successfully.'
        ]);
    }

    /**
     * List all announcements (active & inactive) for Admin.
     */
    public function getAnnouncements(): JsonResponse
    {
        $announcements = Announcement::orderBy('sort_order')->get();
        return response()->json($announcements);
    }

    /**
     * Store new announcement.
     */
    public function storeAnnouncement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = $request->input('sort_order', Announcement::max('sort_order') + 1);

        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement created successfully.',
            'announcement' => $announcement
        ], 201);
    }

    /**
     * Update an announcement.
     */
    public function updateAnnouncement(Request $request, string $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);

        $rules = [
            'text' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ];

        $rulesToValidate = array_intersect_key($rules, $request->all());
        $validated = $request->validate($rulesToValidate);

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }
        if ($request->has('sort_order')) {
            $validated['sort_order'] = intval($request->input('sort_order'));
        }

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated successfully.',
            'announcement' => $announcement
        ]);
    }

    /**
     * Delete an announcement.
     */
    public function destroyAnnouncement(string $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json([
            'message' => 'Announcement deleted successfully.'
        ]);
    }
}
