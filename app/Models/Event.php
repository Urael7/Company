<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'image',
    ];

    /**
     * Accessor to get full URL of the image
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(function () {
            return $this->image ? asset('storage/' . $this->image) : '/images/default.jpg';
        });
    }
}
