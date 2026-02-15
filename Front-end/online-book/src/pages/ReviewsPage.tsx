import { useContentStore } from "@/store/useContentStore";
import { Star } from "lucide-react";

const ReviewsPage = () => {
    const { reviews } = useContentStore();
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-black mb-8 text-center uppercase tracking-tight">Customer Reviews</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedReviews.map((review) => (
                    <div key={review.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-bold text-lg">{review.user}</div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-3 text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted/30"}`}
                                />
                            ))}
                        </div>
                        <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                ))}

                {approvedReviews.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
