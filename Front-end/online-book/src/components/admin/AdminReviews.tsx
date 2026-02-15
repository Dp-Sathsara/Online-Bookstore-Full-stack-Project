import { useContentStore } from "@/store/useContentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for notifications

const AdminReviews = () => {
    const { reviews, updateReviewStatus, deleteReview } = useContentStore();

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this review?")) {
            deleteReview(id);
            toast.success("Review deleted");
        }
    };

    const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
        updateReviewStatus(id, status);
        toast.success(`Review ${status}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight">Reviews</h1>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Book ID</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium">{review.user}</TableCell>
                                <TableCell>{review.bookId}</TableCell>
                                <TableCell>
                                    <span className="flex items-center gap-1 font-bold text-yellow-500">
                                        {review.rating} ★
                                    </span>
                                </TableCell>
                                <TableCell className="max-w-md truncate" title={review.comment}>
                                    {review.comment}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {review.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {review.status === 'pending' && (
                                        <>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleStatusUpdate(review.id, 'approved')}>
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleStatusUpdate(review.id, 'rejected')}>
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(review.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {reviews.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No reviews found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminReviews;
