import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Question, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Book, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Questions',
        href: '/dashboard/questions',
    },
    {
        title: 'View Question',
        href: '/dashboard/questions',
    },
];

export default function DiscussQuestion() {
    const { question } = usePage<{ question: Question }>().props;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswersState, setShowAnswersState] = useState<Record<number, boolean>>({});
    
    // Initialize all questions with answers hidden
    useEffect(() => {
        const initialState: Record<number, boolean> = {};
        question.content.forEach((q) => {
            initialState[q.number] = false;
        });
        setShowAnswersState(initialState);
    }, [question]);
    
    const formatDuration = (minutes: number): string => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
        }
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    };
    
    const renderOption = (key: string, value: string, correctAnswer: string, questionNumber: number) => {
        const isCorrect = key === correctAnswer;
        const showAnswer = showAnswersState[questionNumber] || false;
        return (
            <div key={key} className="mb-2 pl-8">
                <span className="mr-2">{key})</span>
                {isCorrect && showAnswer ? <strong>{value}</strong> : value}
            </div>
        );
    };
    
    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };
    
    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(question.content.length - 1, prevIndex + 1));
    };
    
    const handleToggleAnswer = (questionNumber: number) => {
        setShowAnswersState((prev) => ({
            ...prev,
            [questionNumber]: !prev[questionNumber]
        }));
    };
    
    const currentQuestion = question.content[currentQuestionIndex];
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === question.content.length - 1;
    const isAnswerShown = showAnswersState[currentQuestion?.number] || false;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Question" />
            <div className="relative p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{question.title} Discussion</h1>
                    <div className="flex gap-4">
                        <Button 
                            variant={isAnswerShown ? "default" : "outline"}
                            onClick={() => currentQuestion && handleToggleAnswer(currentQuestion.number)}
                            className="flex items-center gap-2"
                        >
                           
                            {isAnswerShown ? "Hide Answer" : "Show Answer"}
                        </Button>
                        <Link href={route('dashboard.questions.answers', question.uuid)}>
                            <Button className="flex items-center gap-2">
                                <Book className="h-4 w-4" />
                                Scores
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mb-6 flex items-center justify-between">
                    <Badge variant="outline" className="text-md">
                        Duration: {formatDuration(question.duration)}
                    </Badge>
                    <div className="text-sm">
                        Question {currentQuestionIndex + 1} of {question.content.length}
                    </div>
                </div>
                
                {currentQuestion && (
                    <Card className="mb-6">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-lg font-medium">
                                <b>Q{currentQuestion.number}.</b> {currentQuestion.detail}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {currentQuestion.options.map((option) => {
                                const key = Object.keys(option)[0];
                                return renderOption(key, option[key], currentQuestion.answer, currentQuestion.number);
                            })}
                        </CardContent>
                    </Card>
                )}
                
                <div className="flex justify-between mt-6">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={isFirstQuestion}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    
                    {isLastQuestion ? (
                        <Button className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Finish
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-2"
                        >
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}