import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import AppLayout from '@/layouts/app-layout';
import { FlashMessage, PaginatedData, Question, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
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
];

export default function Questions() {
    const { questions, flashMessage } = usePage<{
        questions: PaginatedData<Question>;
        flashMessage: FlashMessage;
    }>().props;

    // State for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Function to parse the HTML entities in pagination labels
    const parseLabel = (label: string) => {
        if (label === '&laquo; Previous') return '← Previous';
        if (label === 'Next &raquo;') return 'Next →';
        return label;
    };

    // Function to handle delete confirmation
    const handleDeleteClick = (question: Question) => {
        setQuestionToDelete(question);
        setDeleteDialogOpen(true);
        // Close the dropdown menu when opening the dialog
        setOpenMenuId(null);
    };

    // Function to execute delete
    const confirmDelete = () => {
        if (questionToDelete) {
            router.delete(route('dashboard.questions.destroy', questionToDelete.uuid), {
                onSuccess: () => {
                    toast.success('Success!', { description: 'Question deleted successfully' });
                },
                onError: () => {
                    toast.error('Error', { description: 'Failed to delete question' });
                }
            });
        }
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
    };

    // Handle dialog closing
    const handleDialogOpenChange = (open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            // Ensure dropdown is closed when dialog closes
            setOpenMenuId(null);
        }
    };

    useEffect(() => {
        if (flashMessage) {
            toast.success('Success!', { description: flashMessage.message });
        }
    }, [flashMessage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Questions" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Questions Management</h1>
                    {questions.total > 0 && (
                        <Link href={route('dashboard.questions.create')}>
                            <Button className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Question
                            </Button>
                        </Link>
                    )}
                </div>

                {questions.total > 0 && (
                    <div className="text-sm text-gray-500">
                        Showing {questions.data.length} of {questions.total} questions
                    </div>
                )}

                {questions.data.length === 0 ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Questions</AlertTitle>
                        <AlertDescription>
                            You haven't created any questions yet. Create your first test.
                            <div className="mt-4">
                                <Button asChild>
                                    <Link href={route('dashboard.questions.create')}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Question
                                    </Link>
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
                                        <TableHead>Title</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="w-20">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {questions.data.map((question) => (
                                        <TableRow key={question.id}>
                                            <TableCell className="font-medium">{question.title}</TableCell>
                                            <TableCell>{new Date(question.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <DropdownMenu 
                                                    open={openMenuId === question.id}
                                                    onOpenChange={(open) => {
                                                        setOpenMenuId(open ? question.id : null);
                                                    }}
                                                >
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Link href={`/dashboard/questions/${question.uuid}`} className="w-full">
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={route('dashboard.questions.answers', question.uuid)} className="w-full">
                                                                Answers/Discuss
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Link href={`/dashboard/questions/${question.uuid}/edit`} className="w-full">
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onSelect={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteClick(question);
                                                        }}>
                                                            Delete
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
                        {questions.last_page > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {questions.links.map((link, index) => (
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{questionToDelete?.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}