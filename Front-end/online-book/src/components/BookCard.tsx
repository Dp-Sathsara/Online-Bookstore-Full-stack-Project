import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/userCartStore";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  rating: number;
  soldCount: number;
}

const BookCard = ({ 
  id, title, author, price, originalPrice, category, image, rating, soldCount 
}: BookCardProps) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const savings = originalPrice - price;

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-xl transition-all duration-300 bg-card rounded-xl flex flex-col h-full font-sans">
      {/* 1. Image Section */}
      <Link to={`/book/${id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge Only (Sale Badge Removed) */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] px-2 h-5 shadow-sm uppercase tracking-wider">
            {category}
          </Badge>
        </div>
      </Link>
      
      {/* 2. Content Section */}
      <CardContent className="p-3 flex-grow flex flex-col">
        {/* Book Title & Author */}
        <div className="mb-2">
          <Link to={`/book/${id}`}>
            <h3 className="font-black text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors tracking-tight text-foreground">
              {title}
            </h3>
          </Link>
          <p className="text-[13px] font-bold text-muted-foreground mt-0.5 italic">By {author}</p>
        </div>

        {/* Rating & Sold Count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-[#1A1A1A]">
            <Star className="h-3 w-3 fill-current text-[#FFA800]" />
            <span className="text-[12px] font-black ml-0.5">{Number(rating).toFixed(1)}</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-bold">
            | {soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k+` : soldCount}+ sold
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 text-[#1A1A1A]">
            <span className="text-[13px] font-black">LKR</span>
            <span className="text-2xl font-black tracking-tighter italic leading-none">
              {price.toLocaleString()}
            </span>
          </div>

          {/* Savings logic */}
          {savings > 0 && (
            <div className="flex items-center gap-1 text-[#FF4747] font-black text-[12px] mt-0.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Save LKR {savings.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* 3. Action Buttons */}
      <CardFooter className="p-3 pt-0 mt-auto flex flex-col gap-2">
        <Button 
          onClick={() => addToCart({ id, title, author, price, image })}
          className="w-full font-black h-10 gap-2 bg-primary hover:bg-primary/90 rounded-full text-xs shadow-md active:scale-95 transition-all uppercase tracking-wider"
        >
          <ShoppingCart className="h-4 w-4" /> 
          Add to Cart
        </Button>

        {/* Similar Books Button */}
        <Button 
          variant="outline"
          onClick={() => navigate(`/category/${category.toLowerCase()}`)}
          className="w-full font-black h-10 gap-2 border-primary/40 text-primary hover:bg-primary/5 rounded-full text-xs active:scale-95 transition-all uppercase tracking-wider"
        >
          <Search className="h-4 w-4" /> 
          Similar Books
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;