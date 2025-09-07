<?php


use Inertia\Inertia;
use App\Models\Announcement;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuditlogController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\PerformanceController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('users', UserController::class, [
        'names' => [
            'index' => 'users',
            'store' => 'users.store',
            'update' => 'users.update',
            'destroy' => 'users.destroy',
        ],
        'only' => ['index','store','update','destroy']
    ])->middleware('permission:View_user_list');
    

    Route::resource('auditlogs', AuditlogController::class,
    ['names' => [
        'index' => 'auditlogs.index',
    ]])->middleware('permission:View_auditlog_list');


    Route::resource('events', EventController::class,
    ['names' => [
        'index' => 'events.index',
        'create' => 'events.create',
        'store' => 'events.store',
        'show' => 'events.show',
        'edit' => 'events.edit',
        'update' => 'events.update',
        'destroy' => 'events.destroy',
    ]])->middleware('permission:View_event_list');

    Route::resource('announcements', AnnouncementController::class,
    ['names' => [
        'index' => 'announcements.index',
        'create' => 'announcements.create',
        'store' => 'announcements.store',
        'show' => 'announcements.show',
        'edit' => 'announcements.edit',
        'update' => 'announcements.update',
        'destroy' => 'announcements.destroy',
    ]])->middleware('permission:View_Announcement_list');

    Route::resource('requests', LeaveRequestController::class,
    ['names' => [
        'index' => 'requests.index',
        'create' => 'requests.create',
        'store' => 'requests.store',
        'show' => 'requests.show',
        'edit' => 'requests.edit',
        'update' => 'requests.update',
        'destroy' => 'requests.destroy',
    ]])->parameters(['requests' => 'leaveRequest'])->middleware('permission:View_leave_requests');
   



    Route::resource('performance', PerformanceController::class,
    ['names' => [
        'index' => 'performance.index',
        'create' => 'performance.create',
        'store' => 'performance.store',
        'show' => 'performance.show',
        'edit' => 'performance.edit',
        'update' => 'performance.update',
        'destroy' => 'performance.destroy',
    ]])->middleware('permission:View_PerformanceReview_list');

    Route::resource('roles', RoleController::class,
    ['names' => [
        'index' => 'roles.index',
        'create' => 'roles.create',
        'store' => 'roles.store',
        'show' => 'roles.show',
        'edit' => 'roles.edit',
        'update' => 'roles.update',
        'destroy' => 'roles.destroy',
    ]])->middleware('permission:View_user_list');
    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
