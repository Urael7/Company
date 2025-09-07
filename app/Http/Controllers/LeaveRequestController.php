<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');

        if ($isAdmin) {
            // Admin sees all pending requests for review
            $pendingRequests = LeaveRequest::with('user')
                ->where('status', 'pending')
                ->latest()
                ->get();
            
            // Also get all requests for statistics
            $allRequests = LeaveRequest::with('user')->latest()->get();
            
            return Inertia::render('requests', [
                'pendingRequests' => $pendingRequests,
                'allRequests' => $allRequests,
                'isAdmin' => true,
                'user' => $user
            ]);
        } else {
            // Employees/Interns see only their own requests
            $userRequests = LeaveRequest::where('user_id', $user->id)->latest()->get();
            
            return Inertia::render('requests', [
                'userRequests' => $userRequests,
                'isAdmin' => false,
                'user' => $user
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'position'   => 'required|in:full-time,part-time,intern,other',
            'type'       => 'required|string',
            'reason'     => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $validated['user_id'] = Auth::id();

        LeaveRequest::create($validated);

        return redirect()->back()->with('success', 'Request submitted successfully!');
    }

    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        $validated = $request->validate([
            'status'  => 'required|in:pending,approved,rejected',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Only Admins should be allowed to approve/reject
        if (!Auth::user()->hasRole('Admin')) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $leaveRequest->update($validated);

        return redirect()->route('requests.index')->with('success', 'Request updated successfully!');
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        // Allow users to delete their own requests OR Admins to delete any
        if (Auth::id() !== $leaveRequest->user_id && !Auth::user()->hasRole('Admin')) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $leaveRequest->delete();
        return redirect()->back()->with('success', 'Request deleted successfully!');
    }
}
