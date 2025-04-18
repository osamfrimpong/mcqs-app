<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use GuzzleHttp\Client;
use App\Models\Question;
use App\Models\Score;
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
        $request->validate([
            'title' => 'bail|required|string|unique:questions,title',
            'duration' => 'bail|required|integer|min:1',
            'content' => 'bail|required|string',
            'description' => 'bail|required|string',
            'visibility' => 'bail|required|string|in:public,private',
        ]);

        // MAKE API CALL TO GOOGLE GEMINI
        // $apiKey = env('GEMINI_API_KEY');
        // $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;


        // $prompt = 'Convert "' . $request->content . '" to a plain JSON array without any formatting as [{"number": 1, "detail": "question goes here", "options":[{"a":"xyz"}, {"b":"xyz"}, {"c":"xyz"}], "answer": "a"}]';
        // $data = [
        //     'contents' => [
        //         [
        //             'parts' => [
        //                 [
        //                     'text' => $prompt
        //                 ]
        //             ]
        //         ]
        //     ]
        // ];

        // $client = new Client();

        try {
            // $response = $client->post($url, [
            //     'json' => $data,
            //     'headers' => [
            //         'Content-Type' => 'application/json'
            //     ]
            // ]);

            // if ($response->getStatusCode() !== 200) {
            //     return redirect()->back()->withInput()->with('flash', [
            //         'message' => 'Failed to generate content',
            //         'type' => 'error'
            //     ]);
            // }

            // $questionContent = $this->extractPlainJSON(json_decode($response->getBody(), true));
            $question = new Question();
            $question->title = $request->title;
            $question->content = json_decode($this->parseQuestions($request->content), true);
            $question->description = $request->description;
            $question->visibility = $request->visibility;
            $question->duration = $request->duration;
            $question->user_id = Auth::id();
            $question->save();
            return redirect()->route('dashboard.questions.index')
                ->with('flash', [
                    'message' => 'Question created successfully',
                    'type' => 'success'
                ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return redirect()->back()
                ->withInput() // Preserve form data
                ->with('flash', [
                    'message' => 'Failed to generate content.',
                    'type' => 'error'
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {

        return Inertia::render('dashboard/questions/show', ['question' => $question]);
    }

    public function discuss(Question $question)
    {

        return Inertia::render('dashboard/assessments/discuss', ['question' => $question]);
    }

    public function answers(Question $question)
    {
        $answers = Score::with('user')->without('question')->where('question_id', $question->id)->paginate(20);
        return Inertia::render('dashboard/assessments/scores', ['scores' => $answers, 'question' => $question]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        return Inertia::render('dashboard/questions/edit', ['question' => $question]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        $request->validate([
            'title' => 'bail|required|string',
            'duration' => 'bail|required|integer|min:1',
            'content' => 'bail|required|string',
            'description' => 'bail|required|string',
            'visibility' => 'bail|required|string|in:public,private',
        ]);

        try {
            $question->title = $request->title;
            $question->content = json_decode($this->parseQuestions($request->content), true);
            $question->description = $request->description;
            $question->visibility = $request->visibility;
            $question->duration = $request->duration;
            $question->user_id = Auth::id();
            $question->save();
            return redirect()->back()
                ->with('flash', [
                    'message' => 'Question updated successfully',
                    'type' => 'success'
                ]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return redirect()->back()
                ->withInput() // Preserve form data
                ->with('flash', [
                    'message' => 'Failed to parse content.',
                    'type' => 'error'
                ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        if ($question->delete()) {
            return redirect()->route('dashboard.questions.index')
                ->with('flash', [
                    'message' => 'Question deleted successfully',
                    'type' => 'success'
                ]);
        }
        return redirect()->back()
            ->with('flash', [
                'message' => 'Question could not be deleted',
                'type' => 'error'
            ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'uuid' => 'bail|required|string',
        ]);
        $searchTerm = $request->input('uuid');
        $question = Question::with('user')->where('uuid', '=', $searchTerm)
            ->first();
        if (is_null($question)) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        return response()->json($question);
    }


    public function takeTest(Question $question)
    {
        return Inertia::render('dashboard/assessments/answer', ['question' => $question]);
    }


    private function extractPlainJSON($responseArray)
    {
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



    private function parseQuestions($text)
    {
        $questions = [];
        $pattern = '/(\d+)\.\s+(.*?)(?:Answer:\s+([a-d])|\z)/si';

        preg_match_all($pattern, $text, $questionMatches, PREG_SET_ORDER);

        foreach ($questionMatches as $questionMatch) {
            $questionNumber = (int)$questionMatch[1];
            $questionText = trim($questionMatch[2]);
            $answer = isset($questionMatch[3]) ? strtolower($questionMatch[3]) : "";

            // Extract options
            $optionPattern = '/([A-D])\.\s+(.*?)(?=\s+[A-D]\.|$)/s';
            preg_match_all($optionPattern, $questionText, $optionMatches, PREG_SET_ORDER);

            // Separate question detail from options
            $detailEndPos = strpos($questionText, 'A.');
            $questionDetail = trim(substr($questionText, 0, $detailEndPos));

            $options = [];
            foreach ($optionMatches as $optionMatch) {
                $optionLetter = strtolower($optionMatch[1]);
                $optionText = trim($optionMatch[2]);
                $options[] = [
                    $optionLetter => $optionText
                ];
            }

            $questions[] = [
                "number" => $questionNumber,
                "detail" => $questionDetail,
                "options" => $options,
                "answer" => $answer
            ];
        }

        return json_encode($questions, JSON_PRETTY_PRINT);
    }
}
