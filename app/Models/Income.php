<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'date',
    ];

    protected $casts = [
        'date'   => 'date',
    ];

    protected $attributes = [
        'amount' => 0,
    ];
}
