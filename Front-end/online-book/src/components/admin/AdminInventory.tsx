import { useState, useRef } from "react";
import { BOOKS as initialBooks } from "@/data/books";
import { 
  Plus, Search, Edit2, Trash2, 
  MoreHorizontal, Save, Upload, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface BookType {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
  stock: number; // Store/Stock column eka vadi kalaa
}

const AdminInventory = () => {
  const [books, setBooks] = useState<BookType[]>(initialBooks.map(b => ({...b, category: (b as any).category || "Novel", stock: (b as any).stock || 20})));
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "", author: "", price: "", image: "", category: "Novel", stock: "10"
  });

  // ✅ Image Upload Logic (File to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (book: BookType | null = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({ 
        title: book.title, author: book.author, 
        price: book.price.toString(), image: book.image, 
        category: book.category, stock: book.stock.toString()
      });
    } else {
      setEditingBook(null);
      setFormData({ title: "", author: "", price: "", image: "", category: "Novel", stock: "10" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { 
        ...b, ...formData, price: Number(formData.price), stock: Number(formData.stock) 
      } : b));
    } else {
      const newBook: BookType = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };
      setBooks([newBook, ...books]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Inventory</h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">Manage books, pricing and stock levels.</p>
        </div>
        <Button onClick={() => handleOpenModal(null)} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest bg-primary">
          <Plus className="h-5 w-5 mr-2" /> Add Book
        </Button>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search inventory..." 
          className="pl-10 h-12 rounded-2xl bg-background border-none shadow-sm font-bold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-background">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8 py-6">Book</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Author</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Category</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Price</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Store/Stock</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id} className="hover:bg-muted/20 border-muted/10 transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={book.image} alt="" className="h-12 w-9 rounded-md object-cover border shadow-sm" />
                      <p className="font-black text-xs uppercase tracking-tight max-w-[120px] truncate">{book.title}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-[11px] uppercase text-muted-foreground">{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black uppercase text-[8px] px-3 py-1 rounded-full bg-primary/10 text-primary border-none">
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-xs italic text-primary">LKR {book.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${book.stock > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-[11px] uppercase">{book.stock} units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 shadow-2xl border-none">
                        <DropdownMenuItem onClick={() => handleOpenModal(book)} className="gap-3 font-bold uppercase text-[10px] py-3 rounded-xl">
                           <Edit2 className="h-3.5 w-3.5 text-blue-500" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 font-bold uppercase text-[10px] py-3 rounded-xl text-destructive">
                           <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ✅ Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] font-sans">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
              {editingBook ? "Edit Inventory Item" : "Add New Inventory"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Image Preview & Upload */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-3xl bg-muted/20 gap-3">
              {formData.image ? (
                <img src={formData.image} className="h-32 w-24 object-cover rounded-xl shadow-lg" alt="Preview" />
              ) : (
                <div className="h-32 w-24 bg-muted rounded-xl flex items-center justify-center text-muted-foreground"><ImageIcon /></div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl font-bold uppercase text-[10px]">
                  <Upload className="h-3 w-3 mr-2" /> Upload File
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Author</Label>
                <Input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Price (LKR)</Label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Store / Stock</Label>
                <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="h-11 rounded-xl bg-muted/50 border-none font-bold" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary shadow-lg shadow-primary/30">
              <Save className="mr-2 h-4 w-4" /> {editingBook ? "Update Stock" : "Add to Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;