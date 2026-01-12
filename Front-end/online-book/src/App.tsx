import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";

// ✅ Components Imports
import Navbar from "./components/Navbar"; 
import Hero from "./components/Hero";
import BookCard from "./components/BookCard";
import { LoginForm } from "./components/LoginForm"; 
import BookDetails from "./components/BookDetails";
import { Button } from "./components/ui/button"; // Button එක ඕනේ
import { Badge } from "./components/ui/badge";
import { ArrowRight } from "lucide-react"; // Icon එක ඕනේ

// ✅ Data Import
import { BOOKS } from "@/data/books";

const HomePage = () => {
  const navigate = useNavigate();

  // ✅ පේළි දෙකකට හරියන්න පොත් 10ක් (5 x 2) තෝරාගන්නවා
  const featuredBooks = BOOKS.slice(0, 10);

  return (
    <>
      <Hero />
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">
              Featured Books
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">Handpicked favorites just for you</p>
          </div>
          <Badge variant="outline" className="hidden sm:flex font-bold px-3 py-1 border-primary/20 text-primary">
            {BOOKS.length} books found
          </Badge>
        </div>
        
        {/* ✅ Grid Section - පේළියට 5ක් (lg:grid-cols-5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* ✅ "View More" Section */}
        <div className="mt-20 flex flex-col items-center justify-center space-y-5 border-t pt-12">
          <div className="text-center">
            <h3 className="text-xl font-bold">Hungry for more?</h3>
            <p className="text-muted-foreground mt-1">Explore our entire collection of thousands of books.</p>
          </div>
          
          <Button 
            size="lg" 
            className="group px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-xl transition-all duration-300 shadow-xl shadow-primary/20"
            onClick={() => navigate("/")} // පස්සේ මේක collection page එකට link කරන්න පුළුවන්
          >
            Explore Full Collection
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </main>
    </>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          
          {/* Navbar */}
          <Navbar setSearchQuery={setSearchQuery} books={BOOKS} />
          
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            
            {/* Book Detail Page */}
            <Route path="/book/:id" element={<BookDetails />} />
            
            <Route 
              path="/login" 
              element={
                <div className="flex items-center justify-center py-20">
                  <LoginForm />
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;