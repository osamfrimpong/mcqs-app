<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['title', 'content', 'description', 'user_id','visibility','duration'];

    protected $table = 'questions';

    protected $casts = [
        'content' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    protected $with = ['user'];
   

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }
}
