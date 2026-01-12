import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/userCartStore";

// Interface එක Spring Boot Backend එකෙන් එන Model එකට සමාන වෙන විදියට හැදුවා
interface BookCardProps {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  image: string;
  rating?: number; // Optional rating field එකක් එකතු කළා
}

const BookCard = ({ id, title, author, price, category, image, rating = 4.5 }: BookCardProps) => {
  const { addToCart } = useCartStore();

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 bg-card rounded-xl">
      {/* 1. Image Section - Click කළාම Detail Page එකට යනවා */}
      <Link to={`/book/${id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none font-bold px-2 py-0.5 shadow-sm">
              {category}
            </Badge>
          </div>
        </div>
      </Link>
      
      {/* 2. Content Section */}
      <CardContent className="p-4">
        {/* Rating - Premium look එකක් දෙනවා */}
        <div className="mb-2 flex items-center gap-1 text-yellow-500">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-bold text-muted-foreground">{rating}</span>
        </div>

        {/* Book Title - Font size ලොකු කළා */}
        <Link to={`/book/${id}`}>
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Author Name - වඩාත් පැහැදිලි කළා */}
        <p className="text-sm font-medium text-muted-foreground mt-1 line-clamp-1">
          {author}
        </p>

        {/* Price - ලොකුවට කැපිලා පේන්න හැදුවා */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-primary">
            Rs. {price.toLocaleString()}
          </span>
        </div>
      </CardContent>

      {/* 3. Action Button */}
      <CardFooter className="p-4 pt-0">
        <Button 
          // ✅ FIX: quantity: 1 අයින් කළා. Store එකේ addToCart({id, title...}) විතරයි බලාපොරොත්තු වෙන්නේ.
          onClick={() => addToCart({ id, title, author, price, image })}
          className="w-full font-bold h-11 gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <ShoppingCart className="h-4 w-4" /> 
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;