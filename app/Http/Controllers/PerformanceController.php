<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PerformanceReview;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PerformanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');
        

        // Get performance data based on user role
        if ($isAdmin) {
            $reviews = PerformanceReview::with(['user', 'reviewer'])
                ->latest()
                ->get();
            
        // Get all users for admin dropdown
        $users = User::all();
        
        } else {
            // Regular users can only see their own reviews
            $reviews = PerformanceReview::with(['user', 'reviewer'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
            
            $users = collect([$user]);
        }

        // Calculate performance statistics
        $stats = $this->getPerformanceStats($reviews, $isAdmin);
        
        // Get performance trends
        $trends = $this->getPerformanceTrends($reviews, $isAdmin);

        
        return Inertia::render('performance', [
            'reviews' => $reviews,
            'users' => $users,
            'stats' => $stats,
            'trends' => $trends,
            'can' => [
                'manage' => $isAdmin,
                'view_all' => $isAdmin,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');

        if (!$isAdmin) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'reviewer_id' => 'nullable|exists:users,id',
            'score' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'attendance_score' => 'nullable|integer|min:0|max:100',
            'efficiency_score' => 'nullable|integer|min:0|max:100',
            'quality_score' => 'nullable|integer|min:0|max:100',
            'teamwork_score' => 'nullable|integer|min:0|max:100',
            'communication_score' => 'nullable|integer|min:0|max:100',
            'punctuality_score' => 'nullable|integer|min:0|max:100',
            'review_period' => 'nullable|string',
            'review_date' => 'nullable|date',
            'goals_achieved' => 'nullable|array',
            'areas_for_improvement' => 'nullable|array',
            'status' => 'nullable|in:pending,completed,needs_improvement',
        ]);

        // Calculate overall score if individual scores are provided
        $scores = [
            $data['attendance_score'] ?? 0,
            $data['efficiency_score'] ?? 0,
            $data['quality_score'] ?? 0,
            $data['teamwork_score'] ?? 0,
            $data['communication_score'] ?? 0,
            $data['punctuality_score'] ?? 0,
        ];
        
        $validScores = array_filter($scores, function($score) {
            return $score > 0;
        });
        
        if (!empty($validScores)) {
            $data['overall_score'] = round(array_sum($validScores) / count($validScores));
        }

        $data['reviewer_id'] = $data['reviewer_id'] ?? $user->id;
        $data['review_date'] = $data['review_date'] ?? now();

        PerformanceReview::create($data);

        return redirect()->back()->with('success', 'Performance review created successfully.');
    }

    public function update(Request $request, PerformanceReview $performanceReview)
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');

        if (!$isAdmin) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'score' => 'nullable|integer|min:0|max:100',
            'notes' => 'nullable|string',
            'attendance_score' => 'nullable|integer|min:0|max:100',
            'efficiency_score' => 'nullable|integer|min:0|max:100',
            'quality_score' => 'nullable|integer|min:0|max:100',
            'teamwork_score' => 'nullable|integer|min:0|max:100',
            'communication_score' => 'nullable|integer|min:0|max:100',
            'punctuality_score' => 'nullable|integer|min:0|max:100',
            'review_period' => 'nullable|string',
            'review_date' => 'nullable|date',
            'goals_achieved' => 'nullable|array',
            'areas_for_improvement' => 'nullable|array',
            'status' => 'nullable|in:pending,completed,needs_improvement',
        ]);

        // Calculate overall score if individual scores are provided
        $scores = [
            $data['attendance_score'] ?? 0,
            $data['efficiency_score'] ?? 0,
            $data['quality_score'] ?? 0,
            $data['teamwork_score'] ?? 0,
            $data['communication_score'] ?? 0,
            $data['punctuality_score'] ?? 0,
        ];
        
        $validScores = array_filter($scores, function($score) {
            return $score > 0;
        });
        
        if (!empty($validScores)) {
            $data['overall_score'] = round(array_sum($validScores) / count($validScores));
        }

        $performanceReview->update($data);

        return redirect()->back()->with('success', 'Performance review updated successfully.');
    }

    public function destroy(PerformanceReview $performanceReview)
    {
        $user = Auth::user();
        $isAdmin = $user->hasRole('Admin');

        if (!$isAdmin) {
            abort(403, 'Unauthorized');
        }

        $performanceReview->delete();

        return redirect()->back()->with('success', 'Performance review deleted successfully.');
    }

    private function getPerformanceStats($reviews, $isAdmin)
    {
        if ($reviews->isEmpty()) {
            return [
                'average_score' => 0,
                'total_reviews' => 0,
                'high_performers' => 0,
                'needs_improvement' => 0,
                'score_distribution' => [],
            ];
        }

        $scores = $reviews->pluck('overall_score')->filter();
        $averageScore = $scores->avg() ?? 0;
        
        $highPerformers = $reviews->where('overall_score', '>=', 85)->count();
        $needsImprovement = $reviews->where('overall_score', '<', 60)->count();

        // Score distribution for charts
        $scoreDistribution = [
            'excellent' => $reviews->where('overall_score', '>=', 90)->count(),
            'good' => $reviews->whereBetween('overall_score', [70, 89])->count(),
            'average' => $reviews->whereBetween('overall_score', [50, 69])->count(),
            'poor' => $reviews->where('overall_score', '<', 50)->count(),
        ];

        return [
            'average_score' => round($averageScore, 1),
            'total_reviews' => $reviews->count(),
            'high_performers' => $highPerformers,
            'needs_improvement' => $needsImprovement,
            'score_distribution' => $scoreDistribution,
        ];
    }

    private function getPerformanceTrends($reviews, $isAdmin)
    {
        if ($reviews->isEmpty()) {
            return [];
        }

        // Group reviews by month for trend analysis
        $trends = $reviews->groupBy(function($review) {
            return $review->created_at->format('Y-m');
        })->map(function($monthReviews) {
            return [
                'month' => $monthReviews->first()->created_at->format('M Y'),
                'average_score' => round($monthReviews->pluck('overall_score')->filter()->avg() ?? 0, 1),
                'count' => $monthReviews->count(),
            ];
        })->values();

        return $trends;
    }
}
