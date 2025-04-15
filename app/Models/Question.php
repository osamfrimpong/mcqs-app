<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['title', 'content', 'description', 'user_id','visibility','duration'];

    protected $table = 'questions';

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function scores()
    {
        return $this->hasMany(Score::class);
    }
}
