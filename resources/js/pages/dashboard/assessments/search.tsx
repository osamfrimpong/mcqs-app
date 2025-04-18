import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Question } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, Search } from 'lucide-react';
import React, { FormEventHandler } from 'react';
import { toast } from 'sonner';

export default function SearchAssessment({
    assessmentId,
    setAssessmentId,
}: {
    assessmentId: string;
    setAssessmentId: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [foundQuestion, setFoundQuestion] = React.useState<Question>();
    const { data, setData, processing, errors } = useForm<Required<{ uuid: string }>>({
        uuid: assessmentId,
    });

    const handleSearchAssessment: FormEventHandler = (e) => {
        e.preventDefault();
        axios
            .post(route('dashboard.questions.search'), {
                uuid: data.uuid,
            })
            .then((response) => {
                setFoundQuestion(response.data);
            })
            .catch((error) => {
                toast.error('Assessment not found!');
            });
    };

    return (
        <div className='space-y-4'>
        <form onSubmit={handleSearchAssessment}>
            <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                    <Input
                        placeholder="Enter Assessment ID"
                        value={data.uuid}
                        onChange={(e) => {
                            setData('uuid', e.target.value);
                            setAssessmentId(e.target.value);
                        }}
                        required
                    />
                </div>
                <Button type="submit" size="sm" disabled={processing}>
                    {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Search
                </Button>
            </div>
        </form>
        {foundQuestion && (
            <Link href={route('dashboard.assessments.take-test', foundQuestion.uuid)}><b>{foundQuestion.title}</b> by <b>{foundQuestion.user.name}</b></Link>
        )}
        </div>
    );
}
