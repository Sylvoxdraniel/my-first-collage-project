<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SyllabusController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\WebsiteControlController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\PageContentController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/public/forgot-password/request', [AuthController::class, 'sendOtp']);
Route::post('/public/forgot-password/verify', [AuthController::class, 'verifyOtpAndResetPassword']);

// Public Payment Gateways
Route::post('/public/payments/razorpay/create-order', [PaymentController::class, 'createRazorpayOrder']);
Route::post('/public/payments/razorpay/verify', [PaymentController::class, 'verifyRazorpaySignature']);

// Public Website Content Routes
Route::post('/public/admissions', [AdmissionController::class, 'store']);
Route::get('/public/admissions/lookup', [AdmissionController::class, 'lookupByAadhaar']);

Route::get('/public/notices', [NoticeController::class, 'index']);
Route::get('/public/notices/{id}', [NoticeController::class, 'show']);
Route::get('/public/gallery', [GalleryController::class, 'index']);
Route::get('/public/events', [EventController::class, 'index']);
Route::get('/public/events/{id}', [EventController::class, 'show']);
Route::get('/public/syllabus', [SyllabusController::class, 'index']);
Route::post('/public/contact-messages', [ContactMessageController::class, 'store']);
Route::get('/public/site-settings', [WebsiteControlController::class, 'publicBootstrap']);
Route::get('/public/fee-structures', [FeeStructureController::class, 'index']);
Route::get('/public/courses', [CourseController::class, 'index']);
Route::get('/public/departments', [DepartmentController::class, 'index']);
Route::get('/public/departments/{id}', [DepartmentController::class, 'show']);
Route::get('/public/page-content/{page}', [PageContentController::class, 'index']);

// Public Route to serve uploads under /api/uploads
Route::get('/uploads/{path}', function ($path) {
    if (str_contains($path, '..')) {
        abort(400, 'Invalid path');
    }

    $filePath = public_path("uploads/{$path}");

    if (!file_exists($filePath) || is_dir($filePath)) {
        abort(404);
    }

    return response()->file($filePath);
})->where('path', '.*');

// Protected Routes (Sanctum Auth)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile & Logout
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // General Dashboard Stats
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Core Management CRUD Endpoints
    Route::apiResource('students', StudentController::class);
    Route::apiResource('faculty', FacultyController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('exams', ExamController::class);
    Route::apiResource('results', ResultController::class);

    // Dynamic Content Managers for Admins
    Route::apiResource('admissions', AdmissionController::class)->except(['store']);
    Route::apiResource('notices', NoticeController::class)->except(['index', 'show']);
    Route::apiResource('gallery', GalleryController::class)->only(['store', 'destroy']);
    Route::apiResource('events', EventController::class)->except(['index', 'show']);
    Route::apiResource('syllabus', SyllabusController::class)->only(['store', 'destroy']);
    Route::apiResource('contact-messages', ContactMessageController::class)->except(['store']);
    Route::apiResource('fee-structures', FeeStructureController::class)->except(['index', 'show'])->middleware('role:admin');
    Route::apiResource('fee-structures', FeeStructureController::class)->only(['index', 'show']);

    // Attendance Operations
    Route::get('/attendance/by-date', [AttendanceController::class, 'getByDate']);
    Route::get('/attendance/student/{id}', [AttendanceController::class, 'studentAttendance']);
    Route::apiResource('attendance', AttendanceController::class);

    // Student specific results
    Route::get('/results/student/{id}', [ResultController::class, 'studentResults']);

    // Dynamic Homepage Control (CMS)
    Route::put('/site-settings', [WebsiteControlController::class, 'updateSettings'])->middleware('role:admin');
    Route::post('/site-settings/logo', [WebsiteControlController::class, 'uploadLogo'])->middleware('role:admin');
    Route::post('/site-settings/affiliation-logo', [WebsiteControlController::class, 'uploadAffiliationLogo'])->middleware('role:admin');
    
    Route::get('/sliders', [WebsiteControlController::class, 'getSliders']);
    Route::post('/sliders', [WebsiteControlController::class, 'storeSlider']);
    Route::post('/sliders/reorder', [WebsiteControlController::class, 'reorderSliders']);
    Route::put('/sliders/{id}', [WebsiteControlController::class, 'updateSlider']);
    Route::delete('/sliders/{id}', [WebsiteControlController::class, 'destroySlider']);

    Route::get('/announcements', [WebsiteControlController::class, 'getAnnouncements']);
    Route::post('/announcements', [WebsiteControlController::class, 'storeAnnouncement']);
    Route::put('/announcements/{id}', [WebsiteControlController::class, 'updateAnnouncement']);
    Route::delete('/announcements/{id}', [WebsiteControlController::class, 'destroyAnnouncement']);

    // Admin User Management
    Route::get('/users', [AuthController::class, 'listUsers'])->middleware('role:admin');
    Route::post('/users', [AuthController::class, 'createUser'])->middleware('role:admin');
    Route::put('/users/{id}', [AuthController::class, 'updateUser'])->middleware('role:admin');
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser'])->middleware('role:admin');

    // Admin Page Content Management
    Route::post('/page-content', [PageContentController::class, 'upsert'])->middleware('role:admin');
    Route::post('/page-content/upload-image', [PageContentController::class, 'uploadImage'])->middleware('role:admin');
});

