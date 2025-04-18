import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Assessment, FlashMessage, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Import Dialog and its components
import { AlertCircle, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SearchAssessment from './search';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Assessments',
        href: '/dashboard/assessments',
    },
];

export default function Assessments() {
    const { assessments, flashMessage } = usePage<{
        assessments: PaginatedData<Assessment>;
        flashMessage: FlashMessage;
    }>().props;

    // State for controlling the take assessment dialog
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assessmentId, setAssessmentId] = useState('');

    // Function to parse the HTML entities in pagination labels
    const parseLabel = (label: string) => {
        if (label === '&laquo; Previous') return '← Previous';
        if (label === 'Next &raquo;') return 'Next →';
        return label;
    };

    useEffect(() => {
        if (flashMessage) {
            toast.success('Success!', { description: flashMessage.message });
        }
    }, [flashMessage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessments" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Assessments Management</h1>
                    {assessments.total > 0 && (
                        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle className="h-4 w-4" />
                            Take Assessment
                        </Button>
                    )}
                </div>

                {assessments.total > 0 && (
                    <div className="text-sm text-gray-500">
                        Showing {assessments.data.length} of {assessments.total} assessments
                    </div>
                )}

                {assessments.data.length === 0 ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Assessments</AlertTitle>
                        <AlertDescription>
                            You haven't created any assessments yet. Create your first test.
                            <div className="mt-4">
                                <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                                    <PlusCircle className="h-4 w-4" />
                                    Take Assessment
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Question</TableHead>
                                        <TableHead>Taken At</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead className="w-20">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assessments.data.map((assessment) => (
                                        <TableRow key={assessment.id}>
                                            <TableCell className="font-medium">{assessment.question.title}</TableCell>
                                            <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {assessment.score}({Math.round((assessment.score / assessment.question.content.length) * 100)}%)
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/dashboard/questions/${assessment.uuid}`} className="w-full">
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {assessments.last_page > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {assessments.links.map((link, index) => (
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
            {/* Take Assessment Dialog Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Take Assessment</DialogTitle>
                    </DialogHeader>
                    <SearchAssessment assessmentId={assessmentId} setAssessmentId={setAssessmentId} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
