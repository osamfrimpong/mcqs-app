import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage, Question, type BreadcrumbItem, Option } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

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
        title: 'Edit Question',
        href: '/dashboard/questions',
    },
];

type EditQuestion = {
    title: string;
    duration: number;
    description: string;
    visibility: string;
    content: string;
};



interface RawQuestion {
  number: number;
  detail: string;
  options: Option[];
  answer: string;
}

function parseAndFormatQuestions(jsonData: string): string {
  try {
    // Parse the JSON string into an array of Question objects
    const questions: RawQuestion[] = JSON.parse(jsonData);
    
    // Format each question according to the specified format
    const formattedQuestions = questions.map(question => {
      // Format the question header with number and detail
      let formattedQuestion = `${question.number}. ${question.detail}\n`;
      
      // Format each option
      question.options.forEach(option => {
        const optionLetter = Object.keys(option)[0].toUpperCase();
        const optionText = option[Object.keys(option)[0]];
        formattedQuestion += `${optionLetter}. ${optionText}\n`;
      });
      
      // Add the answer
      formattedQuestion += `Answer: ${question.answer}`;
      
      return formattedQuestion;
    });
    
    // Join all formatted questions with a newline
    return formattedQuestions.join('\n\n');
  } catch (error) {
    return `Error parsing JSON: ${error}`;
  }
}

export default function EditQuestion() {
    const { flash, question } = usePage<{ flash: FlashMessage; question: Question }>().props;
  

    useEffect(() => {
        if (flash && flash.type === 'error') {
            toast.error('Error!', { description: flash.message });
        }
        if (flash && flash.type === 'success') {
            toast.success('Success!', { description: flash.message });
        }
    }, [flash]);


    const { data, setData, patch, processing, errors } = useForm<Required<EditQuestion>>({
        title: question.title,
        duration: question.duration,
        description: question.description,
        visibility: 'private',
        content: parseAndFormatQuestions(JSON.stringify(question.content)),
    });


    const saveQuestion: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('dashboard.questions.update', question.uuid), {
            onFinish: () => null,
            onError: (errors) => {
                // Show error toast
                toast.error('Error Updating Question!', { description: errors.message });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Question" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Question {question.title}</h1>
                <form onSubmit={saveQuestion} className="space-y-6">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="email">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Question Title"
                            required
                            autoFocus
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            rows={3}
                            id="description"
                            placeholder="Question Description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                            type="number"
                            id="duration"
                            placeholder="Duration in minutes"
                            required
                            value={data.duration}
                            onChange={(e) => setData('duration', parseInt(e.target.value))}
                        />
                        <InputError message={errors.duration} />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select value={data.visibility} onValueChange={(value) => setData('visibility', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                        </Select>

                        <InputError message={errors.visibility} />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            rows={10}
                            id="content"
                            placeholder="Question Content"
                            required
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                        <InputError message={errors.content} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Update Question
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
