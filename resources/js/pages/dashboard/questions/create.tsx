import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { FlashMessage, type BreadcrumbItem } from '@/types';
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
        title: 'Create Question',
        href: '/dashboard/questions/create',
    },
];

type CreateQuestion = {
    title: string;
    duration: number;
    description: string;
    visibility: string;
    content: string;
};

export default function CreateQuestion() {
    const { flash, } = usePage<{ flash: FlashMessage }>().props;
  

    useEffect(() => {
        if (flash && flash.type === 'error') {
            toast.error('Error!', { description: flash.message });
        }
        if (flash && flash.type === 'success') {
            toast.success('Success!', { description: flash.message });
        }
    }, [flash]);


    const { data, setData, post, processing, errors } = useForm<Required<CreateQuestion>>({
        title: '',
        duration: 0,
        description: '',
        visibility: 'private',
        content: '',
    });


    const saveQuestion: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dashboard.questions.store'), {
            onFinish: () => null,
            onError: (errors) => {
                // Show error toast
                toast.error('Error Creating Question!', { description: errors.message });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Question" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Create Question</h1>
                <Button onClick={() => toast.success('Hello')}>Toast</Button>
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
                        Save Question
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
