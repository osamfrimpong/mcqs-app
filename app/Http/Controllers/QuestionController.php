<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use GuzzleHttp\Client;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = Question::where('user_id', Auth::id())->paginate(10);
        Log::info($questions);
        return Inertia::render('dashboard/questions/index', ['questions' => $questions]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/questions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'title' => 'required|string',
            'duration' => 'required|integer',
            'content' => 'required|string',
            'description' => 'required|string',
            'visibility' => 'required|string',
        ]);

        if ($validation->fails()) {
            return redirect()->back()->with([
                'message' => 'Validation failed',
                'type' => 'error',
                'errors' => $validation->errors()
            ]);
        }

        // MAKE API CALL TO GOOGLE GEMINI
        $apiKey = env('GEMINI_API_KEY');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;


        $prompt = 'Convert "' . $request->content . '" to a plain JSON array without any formatting as [{"number": 1, "detail": "question goes here", "options":[{"a":"xyz"}, {"b":"xyz"}, {"c":"xyz"}], "answer": "a"}]';
        $data = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => $prompt
                        ]
                    ]
                ]
            ]
        ];

        $client = new Client();

        try {
            $response = $client->post($url, [
                'json' => $data,
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                return redirect()->back()->with([
                    'message' => 'Failed to generate content',
                    'type' => 'error'
                ]);
            }

            $questionContent = $this->extractPlainJSON(json_decode($response->getBody(), true));
            $question = new Question();
            $question->title = $request->title;
            $question->content = $questionContent;
            $question->description = $request->description;
            $question->visibility = $request->visibility;
            $question->duration = $request->duration;
            $question->user_id = Auth::id();
            $question->save();
            return redirect()->back()->with([
               'message' => 'Question created successfully',
                'type' => 'success' 
            ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return redirect()->back()->with([
                'message' => 'Failed to generate content',
                'type' => 'error'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }


    private function extractPlainJSON($responseArray) {
        // Navigate through the array structure to find the text containing JSON
        if (isset($responseArray['candidates'][0]['content']['parts'][0]['text'])) {
            $rawText = $responseArray['candidates'][0]['content']['parts'][0]['text'];
            
            // Extract just the JSON content by removing markdown code block syntax
            $plainJSON = preg_replace('/```json\s*([\s\S]*?)\s*```/', '$1', $rawText);
            
            // Return the cleaned JSON text
            return trim($plainJSON);
        }
        
        return null; // Return null if the expected structure isn't found
    }
}
