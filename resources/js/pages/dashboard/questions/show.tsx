import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Question, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle } from 'lucide-react';

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
  }
];

export default function ShowQuestion() {
  const { question } = usePage<{ question: Question }>().props;
  const [copied, setCopied] = useState(false);

  const formatDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const copyUuid = () => {
    navigator.clipboard.writeText(question.uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderOption = (key: string, value: string, correctAnswer: string) => {
    const isCorrect = key === correctAnswer;
    return (
      <div key={key} className="pl-8 mb-2">
        <span className="mr-2">{key})</span>
        {isCorrect ? <strong>{value}</strong> : value}
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Question" />
      
      <div className="relative p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{question.title}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyUuid}
            className="flex items-center gap-2"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy UUID'}
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">{question.description}</p>
          <Badge variant="outline" className="text-md">
            Duration: {formatDuration(question.duration)}
          </Badge>
        </div>

        <div className="space-y-6">
          {question.content.map((q, index) => (
            <Card key={index} className="mb-4">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-medium">
                  <b>Q{q.number}.</b> {q.detail}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {q.options.map(option => {
                  const key = Object.keys(option)[0];
                  return renderOption(key, option[key], q.answer);
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}