<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assessments = Score::where('user_id', Auth::id())->paginate(10);
        return Inertia::render('dashboard/assessments/index', ['assessments' => $assessments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'question_id' => 'required|exists:questions,id',
            'answers' => 'required|array',
        ]);
        
        $data = $request->all();
        $data['user_id'] = Auth::id();
        
        try {
            $score = Score::create($data);
            return redirect()->back()->with('flash', [
                'type' => 'success',
                'message' => 'Assessment taken successfully'
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Could not save assessment, please try again later'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Score $score)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Score $score)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Score $score)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Score $score)
    {
        //
    }
}
