import { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Article } from "@/types/content";

const AdminArticles = () => {
    const { articles, addArticle, updateArticle, deleteArticle } = useContentStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "",
        author: "Admin", // Default author
        status: "published" as "published" | "draft"
    });

    const handleOpenDialog = (article?: Article) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title,
                content: article.content,
                image: article.image,
                author: article.author,
                status: article.status
            });
        } else {
            setEditingArticle(null);
            setFormData({ title: "", content: "", image: "", author: "Admin", status: "published" });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newArticle: Article = {
            id: editingArticle ? editingArticle.id : Date.now().toString(),
            date: editingArticle ? editingArticle.date : new Date().toISOString().split('T')[0],
            ...formData
        };

        if (editingArticle) {
            updateArticle(newArticle);
            toast.success("Article updated");
        } else {
            addArticle(newArticle);
            toast.success("Article created");
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this article?")) {
            deleteArticle(id);
            toast.success("Article deleted");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black tracking-tight">Articles</h1>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> New Article
                </Button>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell>
                                    <div className="h-10 w-16 bg-muted rounded overflow-hidden">
                                        {article.image ? (
                                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground"><ImageIcon className="h-4 w-4" /></div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell>{article.author}</TableCell>
                                <TableCell>{article.date}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${article.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {article.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => handleOpenDialog(article)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(article.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {articles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No articles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingArticle ? "Edit Article" : "Create Article"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Article Title"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author</label>
                                <Input
                                    required
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Author Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <Input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                required
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your article here..."
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingArticle ? "Update" : "Publish"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminArticles;
