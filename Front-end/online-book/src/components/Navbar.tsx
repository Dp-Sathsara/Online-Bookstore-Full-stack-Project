import { useState, useEffect, useRef } from "react";
import { Search, User, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ FIX: Named Exports ({ }) සහ Relative Paths (./) භාවිතා කිරීම
import { ModeToggle } from "./mode-toggle"; 
import { CartDrawer } from "./CartDrawer"; 

interface NavbarProps {
  setSearchQuery: (query: string) => void;
  books: any[]; 
}

const Navbar = ({ setSearchQuery, books }: NavbarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search Logic
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.keywords?.some((k: string) => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5); 
      
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, books]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (bookId: number) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/book/${bookId}`); 
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <BookOpen className="text-primary" />
          <span className="tracking-tighter">BOOK<span className="text-primary">SHELF</span></span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-full max-w-sm items-center mx-4" ref={dropdownRef}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-9 bg-muted focus-visible:ring-primary shadow-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button 
              type="button"
              onClick={() => { setQuery(""); setIsOpen(false); }} 
              className="absolute right-2.5 hover:text-primary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {/* SUGGESTION BOX */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-card border rounded-b-xl shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[100]">
              <div className="p-2 text-[10px] font-bold text-muted-foreground border-b uppercase tracking-wider bg-muted/30">
                Quick Results
              </div>
              {suggestions.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => handleSuggestionClick(book.id)}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0 transition-colors group"
                >
                  <img src={book.image} alt={book.title} className="h-12 w-9 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground line-clamp-1">{book.title}</span>
                    <span className="text-xs text-muted-foreground">{book.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
          <CartDrawer />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Orders</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer font-medium">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;