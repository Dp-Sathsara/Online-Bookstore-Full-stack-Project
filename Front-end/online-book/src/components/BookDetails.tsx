import { useParams, useNavigate } from "react-router-dom";
import { BOOKS } from "@/data/books";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/userCartStore";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import BookCard from "./BookCard";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [id]);

  const book = BOOKS.find((b) => b.id === Number(id));

  // ✅ පේළියට 5ක් පෙන්වන්න නිසා slice(0, 5) කරලා පොත් 5ක් ගත්තා
  const relatedBooks = BOOKS.filter(
    (b) => (b.category === book?.category || b.author === book?.author) && b.id !== book?.id
  ).slice(0, 5);

  const handleAddToCart = () => {
    if (book) {
      for (let i = 0; i < quantity; i++) {
        addToCart(book);
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Book not found!</h2>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-in slide-in-from-right-10 fade-in duration-300 ease-in-out">
      
      <Button variant="ghost" className="mb-6 gap-2 hover:bg-muted/50" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="flex justify-center bg-muted/20 rounded-xl p-8 items-center border">
          <img 
            src={book.image} 
            alt={book.title} 
            className="w-full max-w-[300px] md:max-w-[350px] shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="mb-3 px-3 py-1 text-sm" variant="secondary">{book.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-2 font-medium">{book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(book.rating || 4) ? "fill-current" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(120 reviews)</span>
          </div>

          <div className="text-3xl font-bold text-primary">
            Rs. {book.price}
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">
            {book.description || "No description available for this book. It covers the main themes and is a must-read."}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={decreaseQty}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-bold text-lg">{quantity}</div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={increaseQty}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className={`flex-1 h-14 text-lg font-bold gap-2 ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-lg font-semibold">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Suggestion Section - පේළියට 5ක් පෙනෙන විදියට හැදුවා */}
      {relatedBooks.length > 0 && (
        <div className="border-t pt-10">
          <h3 className="text-2xl font-bold mb-6">You might also like</h3>
          {/* grid-cols-2 (mobile), md:grid-cols-3 (tablet), lg:grid-cols-5 (desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook.id} {...relatedBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;