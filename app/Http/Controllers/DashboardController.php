<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Auditlog;
use App\Models\Event;
use App\Models\LeaveRequest;
use App\Models\PerformanceReview;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');

        $hasOccurredAt = Schema::hasColumn('auditlogs', 'occurred_at');

        $stats = [
            'users' => $isAdmin ? User::count() : null,
            'events' => Event::count(),
            'announcements' => Announcement::count(),
            'leave_pending' => $isAdmin ? LeaveRequest::where('status', 'pending')->count() : LeaveRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
            'performance_reviews' => $isAdmin ? PerformanceReview::count() : PerformanceReview::where('user_id', $user->id)->count(),
            'recent_logs' => $isAdmin
                ? ($hasOccurredAt
                    ? Auditlog::latest('occurred_at')->limit(5)->get(['action','occurred_at','status_code'])
                    : Auditlog::latest('created_at')->limit(5)->get(['action','created_at as occurred_at','status_code']))
                : [],
        ];

        $can = [
            'manage_users' => $user->can('View_user_list'),
            'view_audit' => $user->can('View_auditlog_list'),
            'view_events' => $user->can('View_event_list'),
            'view_announcements' => $user->can('View_Announcement_list'),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'can' => $can,
            'isAdmin' => $isAdmin,
        ]);
    }
}


