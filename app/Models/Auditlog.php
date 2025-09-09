<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Auditlog extends Model
{
    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'action',
        'route_name',
        'http_method',
        'url',
        'target_type',
        'target_id',
        'status_code',
        'message',
        'meta',
        'context',
        'occurred_at',
        'impersonated_by',
    ];

    protected $casts = [
        'meta' => 'array',
        'context' => 'array',
        'occurred_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
