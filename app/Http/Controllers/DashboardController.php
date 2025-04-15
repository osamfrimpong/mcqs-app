<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $assessments = Auth::user()->scores;
        $questions = Auth::user()->questions;
        return Inertia::render('dashboard', ['assessments' => $assessments, 'questions' => $questions]);
    }
}
