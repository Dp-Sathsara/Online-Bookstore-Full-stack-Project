import { useContentStore } from "@/store/useContentStore";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";

const ArticlesPage = () => {
    const { articles } = useContentStore();
    const publishedArticles = articles.filter(a => a.status === 'published');

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-black mb-8 text-center uppercase tracking-tight">Latest Articles</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publishedArticles.map((article) => (
                    <article key={article.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {article.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {article.author}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-3 leading-tight line-clamp-2">{article.title}</h2>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                {article.content}
                            </p>
                            <Link to={`/articles/${article.id}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide hover:underline mt-auto">
                                Read More <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </article>
                ))}

                {publishedArticles.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No articles published yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlesPage;
