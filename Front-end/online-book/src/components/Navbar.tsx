import { useState, useEffect, useRef } from "react";
import { Search, User, BookOpen, X, Package, Settings, LogOut, LogIn } from "lucide-react"; 
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

// ✅ Correct Imports
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 font-sans">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl cursor-pointer tracking-tighter uppercase italic">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>BOOK<span className="text-primary">AURA</span></span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-full max-sm items-center mx-4" ref={dropdownRef}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-9 bg-muted/50 focus-visible:ring-primary shadow-none h-10 rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button 
              type="button"
              onClick={() => { setQuery(""); setIsOpen(false); }} 
              className="absolute right-3 hover:text-primary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {/* SUGGESTION BOX */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-card border rounded-xl shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[100]">
              <div className="p-2 text-[10px] font-bold text-muted-foreground border-b uppercase tracking-wider bg-muted/30">
                Quick Results
              </div>
              {suggestions.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => handleSuggestionClick(book.id)}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0 transition-colors group"
                >
                  <img src={book.image} alt={book.title} className="h-10 w-8 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground line-clamp-1">{book.title}</span>
                    <span className="text-xs text-muted-foreground">by {book.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2">
          <ModeToggle />
          
          <CartDrawer />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/50 ml-1 p-0 overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 font-sans rounded-[1.2rem] shadow-2xl border-none" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-black uppercase italic tracking-tight leading-none">Desitha Sathsara</p>
                  <p className="text-[10px] font-bold leading-none text-muted-foreground uppercase tracking-widest mt-1">desitha@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted" />
              
              {/* ✅ 1. Profile Settings Route */}
              <DropdownMenuItem 
                className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                onClick={() => navigate("/profile")}
              >
                <Settings className="mr-3 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>

              {/* ✅ 2. My Orders Route */}
              <DropdownMenuItem 
                className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                onClick={() => navigate("/orders")}
              >
                <Package className="mr-3 h-4 w-4" />
                My Orders
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-muted" />
              
              <DropdownMenuItem 
                className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-3 h-4 w-4" />
                Login
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-black uppercase text-[10px] tracking-widest py-3">
                <LogOut className="mr-3 h-4 w-4" />
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