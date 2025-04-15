import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface Assessment {
  id: number;
  title: string;
  created_at: string;
  questions_count: number;
  status: string;
}

interface Question {
  id: number;
  content: string;
  created_at: string;
  type: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface DashboardProps {
  assessments: Assessment[];
  questions: Question[];
  auth: {
    user: User;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ assessments, questions, auth }: DashboardProps) {
  const getGreeting = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      
      <div className="space-y-6 p-8">
        {/* Welcome message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {auth.user.name}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome to your Quiz App Dashboard. Here's an overview of your quizzes and questions.
          </p>
        </div>

        {/* Alerts for no questions or assessments */}
        <div className="grid gap-4 md:grid-cols-2">
          {questions.length === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Questions</AlertTitle>
              <AlertDescription>
                You haven't created any questions yet. Create your first test.
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/questions/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Question
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {assessments.length === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Assessments</AlertTitle>
              <AlertDescription>
                You haven't taken any assessments yet. Take your first assessment.
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/assessments/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Take Assessment
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Recent Questions */}
        {questions.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>You have {questions.length} questions in total</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/questions">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.slice(0, 5).map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.content.length > 60 
                        ? `${question.content.substring(0, 60)}...` 
                        : question.content}
                      </TableCell>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>{formatDistance(new Date(question.created_at), new Date(), { addSuffix: true })}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/questions/${question.id}/edit`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Assessments */}
        {assessments.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>You have {assessments.length} assessments in total</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/assessments">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.slice(0, 5).map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>{assessment.questions_count}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${assessment.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'}`}>
                          {assessment.status === 'published' ? 'Published' : 'Draft'}
                        </div>
                      </TableCell>
                      <TableCell>{formatDistance(new Date(assessment.created_at), new Date(), { addSuffix: true })}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/assessments/${assessment.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}