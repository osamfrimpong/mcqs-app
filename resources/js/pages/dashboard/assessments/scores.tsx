import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Assessment, PaginatedData, Question, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Speaker } from 'lucide-react';

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
        title: 'Scores',
        href: '/dashboard/questions',
    },
];
export default function Scores() {
    const { scores, question } = usePage<{
        scores: PaginatedData<Assessment>;
        question: Question;
    }>().props;

    const parseLabel = (label: string) => {
        if (label === '&laquo; Previous') return '← Previous';
        if (label === 'Next &raquo;') return 'Next →';
        return label;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Question" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{question.title} Scores</h1>
                    {scores.total > 0 && (
                        <Link href={route('dashboard.questions.discuss', question.uuid)}>
                            <Button className="flex items-center gap-2">
                                <Speaker className="h-4 w-4" />
                                Discuss
                            </Button>
                        </Link>
                    )}
                </div>

                {scores.total > 0 && (
                    <div className="text-sm text-gray-500">
                        Showing {scores.data.length} of {scores.total} Scores
                    </div>
                )}

                {scores.data.length === 0 ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Scores</AlertTitle>
                        <AlertDescription>
                            No users have answered these questions yet.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Taken At</TableHead>
                                        <TableHead>Score</TableHead>
                                        {/* <TableHead className="w-20">Actions</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scores.data.map((score) => (
                                        <TableRow key={score.id}>
                                            <TableCell className="font-medium">{score.user.name}</TableCell>
                                            <TableCell>{new Date(score.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {score.score}({Math.round((score.score / question.content.length) * 100)}%)
                                            </TableCell>
                                            {/* <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/dashboard/questions/${score.uuid}`} className="w-full">
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {scores.last_page > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {scores.links.map((link, index) => (
                                        <PaginationItem key={index}>
                                            {link.url ? (
                                                <PaginationLink href={link.url} isActive={link.active}>
                                                    {parseLabel(link.label)}
                                                </PaginationLink>
                                            ) : (
                                                <span className="flex h-10 w-10 items-center justify-center rounded-md text-gray-400">
                                                    {parseLabel(link.label)}
                                                </span>
                                            )}
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
