<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceReview extends Model
{
    protected $fillable = [
        'user_id',
        'reviewer_id',
        'score',
        'notes',
        'attendance_score',
        'efficiency_score',
        'quality_score',
        'teamwork_score',
        'communication_score',
        'punctuality_score',
        'overall_score',
        'review_period',
        'review_date',
        'goals_achieved',
        'areas_for_improvement',
        'status',
    ];

    protected $casts = [
        'goals_achieved' => 'array',
        'areas_for_improvement' => 'array',
        'review_date' => 'date',
    ];

    /**
     * The user being reviewed.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The reviewer (e.g., manager, HR).
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
