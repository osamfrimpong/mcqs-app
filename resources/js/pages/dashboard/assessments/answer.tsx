import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { Option, Question, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define types

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Assessments',
        href: '/dashboard/assessments',
    },
    {
        title: 'Take Assessment',
        href: '/dashboard/assessments',
    },
];

export default function AnswerQuestion() {
    const { question } = usePage<{ question: Question }>().props;

    // States
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    // Initialize or resume timer
    useEffect(() => {
        if (started && timeRemaining === null) {
            // Check local storage for saved time
            const savedTime = localStorage.getItem(`assessment_time_${question.uuid}`);
            const totalSeconds = question.duration * 60;

            if (savedTime) {
                const parsedTime = parseInt(savedTime, 10);
                // If there's remaining time, use it; otherwise start fresh
                setTimeRemaining(parsedTime > 0 ? parsedTime : totalSeconds);
            } else {
                setTimeRemaining(totalSeconds);
            }

            // Load saved answers if any
            const savedAnswers = localStorage.getItem(`assessment_answers_${question.uuid}`);
            if (savedAnswers) {
                setUserAnswers(JSON.parse(savedAnswers));
            }
        }
    }, [started, question.uuid, question.duration, timeRemaining]);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (started && timeRemaining !== null && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    const newTime = prevTime! - 1;
                    // Save remaining time to localStorage
                    localStorage.setItem(`assessment_time_${question.uuid}`, newTime.toString());
                    return newTime;
                });
            }, 1000);
        } else if (timeRemaining === 0) {
            handleSubmit();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [started, timeRemaining, question.uuid]);

    // Save answers to localStorage whenever they change
    useEffect(() => {
        if (started) {
            localStorage.setItem(`assessment_answers_${question.uuid}`, JSON.stringify(userAnswers));
        }
    }, [userAnswers, question.uuid, started]);

    const handleCancel = () => {
        router.visit('/dashboard/assessments');
    };

    const handleStartTest = () => {
        setStarted(true);
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < question.content.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowSummary(true);
        }
    };

    const handleAnswer = (value: string) => {
        setUserAnswers({
            ...userAnswers,
            [question.content[currentQuestionIndex].number]: value,
        });
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        question.content.forEach((q) => {
            if (userAnswers[q.number] === q.answer) {
                correctAnswers++;
            }
        });
        return {
            score: correctAnswers,
            total: question.content.length,
            percentage: Math.round((correctAnswers / question.content.length) * 100),
        };
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const result = calculateScore();
        setScore(result.score);

        // In a real app, you'd send results to the server here
        router.post(
            route('dashboard.assessments.store'),
            {
                answers: userAnswers,
                score: result.score,
                question_id: question.id,
            },
            {
                onSuccess: () => {
                    // Clear localStorage after submission
                    localStorage.removeItem(`assessment_time_${question.uuid}`);
                    localStorage.removeItem(`assessment_answers_${question.uuid}`);
                    toast.success('Success!', { description: 'Assessment submitted successfully!' });
                    setIsSubmitting(false);
                },
                onError: (error) => {
                    toast.error('Error', { description: error.message });
                    setIsSubmitting(false);
                },
            },
        );
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getOptionKey = (optionObj: Option) => {
        return Object.keys(optionObj)[0];
    };

    const getOptionValue = (optionObj: Option) => {
        const key = getOptionKey(optionObj);
        return optionObj[key];
    };

    // Render the assessment intro screen
    if (!started) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={question.title} />
                <Card className="m-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{question.title}</CardTitle>
                                <CardDescription className="mt-2">
                                    Created by {question.user.name} on {format(new Date(question.created_at), 'PPP')}
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {question.duration} minutes
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6 text-lg">{question.description}</p>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Important Information</AlertTitle>
                            <AlertDescription>
                                This assessment contains {question.content.length} questions and has a time limit of {question.duration} minutes. Once
                                you start, the timer cannot be paused. Make sure you have enough time to complete the assessment.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex justify-start gap-4">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleStartTest}>Take Test</Button>
                    </CardFooter>
                </Card>
            </AppLayout>
        );
    }

    // Render the score screen after submission
    if (score !== null) {
        const result = calculateScore();
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Assessment Results" />
                <Card className="mx-auto max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Assessment Complete</CardTitle>
                        <CardDescription>{question.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center py-6">
                            <div className="mb-2 text-6xl font-bold">{result.percentage}%</div>
                            <p className="mb-4 text-lg">
                                You scored {result.score} out of {result.total}
                            </p>
                            <Progress value={result.percentage} className="mt-4 h-4 w-full" />
                        </div>
                        <Alert className={result.percentage >= 70 ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
                            {result.percentage >= 70 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                            )}
                            <AlertTitle>{result.percentage >= 70 ? 'Congratulations!' : 'Keep practicing'}</AlertTitle>
                            <AlertDescription>
                                {result.percentage >= 70
                                    ? "You've done well on this assessment."
                                    : "Don't worry! Review the material and try again later."}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={() => router.visit('/dashboard/assessments')}>Return to Assessments</Button>
                    </CardFooter>
                </Card>
            </AppLayout>
        );
    }

    // Render the summary screen
    if (showSummary) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Assessment Summary" />
                <Card className="m-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Review Your Answers</CardTitle>
                            <CardDescription>{question.title}</CardDescription>
                        </div>
                        {timeRemaining !== null && (
                            <Badge variant="outline" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatTime(timeRemaining)}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 grid grid-cols-5 gap-2">
                            {question.content.map((q, index) => {
                                const isAnswered = userAnswers[q.number] !== undefined;
                                return (
                                    <Button
                                        key={q.number}
                                        variant={isAnswered ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            setCurrentQuestionIndex(index);
                                            setShowSummary(false);
                                        }}
                                        // className={isAnswered ? "bg-blue-500 hover:bg-blue-600" : ""}
                                    >
                                        {q.number}
                                    </Button>
                                );
                            })}
                        </div>
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Ready to submit?</AlertTitle>
                            <AlertDescription>
                                You've answered {Object.keys(userAnswers).length} out of {question.content.length} questions. You can go back to
                                review or change any answers before submitting.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setShowSummary(false)}>
                            Back to Questions
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                        </Button>
                    </CardFooter>
                </Card>
            </AppLayout>
        );
    }

    // Render individual questions
    const currentQuestion = question.content[currentQuestionIndex];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Question ${currentQuestion.number}`} />
            <Card className="m-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">{question.title}</CardTitle>
                        <CardDescription>
                            Question {currentQuestion.number} of {question.content.length}
                        </CardDescription>
                    </div>
                    {timeRemaining !== null && (
                        <Badge variant="outline" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatTime(timeRemaining)}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    <Progress value={((currentQuestionIndex + 1) / question.content.length) * 100} className="mb-6 h-2" />
                    <div className="space-y-6">
                        <div className="text-lg font-medium">{currentQuestion.detail}</div>
                        <RadioGroup value={userAnswers[currentQuestion.number] || ''} onValueChange={handleAnswer} className="space-y-3">
                            {currentQuestion.options.map((option, i) => (
                                <div key={i} className="flex items-center space-x-2 rounded-md border p-3">
                                    <RadioGroupItem value={getOptionKey(option)} id={`option-${currentQuestion.number}-${getOptionKey(option)}`} />
                                    <Label htmlFor={`option-${currentQuestion.number}-${getOptionKey(option)}`} className="flex-1">
                                        <span className="mr-2 font-semibold">{getOptionKey(option)}.</span>
                                        {getOptionValue(option)}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Previous
                    </Button>
                    <Button onClick={handleNext} className="flex items-center gap-2">
                        {currentQuestionIndex < question.content.length - 1 ? (
                            <>
                                Next <ArrowRight className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Review <CheckCircle className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </AppLayout>
    );
}
