import { useEffect, useState } from "react";
import { ReviewService, type Review } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await ReviewService.getAll();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await ReviewService.delete(id);
            setReviews(reviews.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Failed to delete review", error);
            alert("Failed to delete review");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Review Management</h2>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {review.bookImage && <img src={review.bookImage} alt="" className="w-8 h-10 object-cover rounded" />}
                                        <span className="line-clamp-1 max-w-[150px]" title={review.bookTitle}>{review.bookTitle || "Unknown"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{review.userName}</TableCell>
                                <TableCell>
                                    <span className="text-yellow-500 font-bold">★ {review.rating}</span>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate" title={review.comment}>
                                    {review.comment}
                                </TableCell>
                                <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
