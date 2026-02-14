import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import CheckoutPage from "./components/CheckoutPage";

// ✅ Components Imports
import Navbar from "./components/Navbar"; 
import Hero from "./components/Hero";
import BookCard from "./components/BookCard";
import { LoginForm } from "./components/LoginForm"; 
import { RegisterForm } from "./components/RegisterForm"; 
import { ForgotPasswordForm } from "./components/ForgotPasswordForm"; 
import BookDetails from "./components/BookDetails";
// 👇 අලුත් Import එක: Category Page
import CategoryPage from "./components/CategoryPage"; 
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ArrowRight } from "lucide-react";

// ✅ Data Import
import { BOOKS } from "@/data/books";

const HomePage = () => {
  const navigate = useNavigate();
  const featuredBooks = BOOKS.slice(0, 10);

  return (
    <>
      <Hero />
      <main className="container mx-auto px-4 py-16 font-sans">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Featured Books
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium">Handpicked favorites just for you</p>
          </div>
          <Badge variant="outline" className="hidden sm:flex font-black px-4 py-1.5 border-primary/20 text-primary text-sm uppercase tracking-wider">
            {BOOKS.length} items found
          </Badge>
        </div>
        
        {/* Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* "View More" Section */}
        <div className="mt-20 flex flex-col items-center justify-center space-y-6 border-t border-primary/10 pt-16">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Hungry for more?</h3>
            <p className="text-muted-foreground font-medium text-lg">Explore our entire collection of thousands of books.</p>
          </div>
          
          <Button 
            size="lg" 
            className="group px-12 h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-2xl transition-all duration-300 shadow-2xl shadow-primary/30 uppercase tracking-widest"
            onClick={() => navigate("/")} 
          >
            Explore Full Collection
            <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </main>
    </>
  );
};

// ✅ Navbar Control Component
const Layout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Navbar එක හංගන්න ඕන පිටු ලිස්ට් එක
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  
  // දැනට ඉන්න පිටුව අර ලිස්ට් එකේ තියෙනවද බලනවා
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-black text-foreground transition-colors duration-300 font-sans">
      
      {/* Login පිටුවේ නැත්නම් විතරක් Navbar එක පෙන්වන්න */}
      {shouldShowNavbar && <Navbar setSearchQuery={setSearchQuery} books={BOOKS} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        
        <Route path="/book/:id" element={<BookDetails />} />

        {/* ✅ අලුත් Category Page Route එක */}
        {/* :category කියන තැනට URL එකේ එන නම (Ex: fiction) වැටෙනවා */}
        <Route path="/category/:category" element={<CategoryPage />} />
        
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            <div className="flex items-center justify-center min-h-[80vh] px-4">
              <LoginForm />
            </div>
          } 
        />

        {/* Register Route */}
        <Route 
          path="/register" 
          element={
            <div className="flex items-center justify-center min-h-[80vh] px-4">
              <RegisterForm />
            </div>
          } 
        />

        {/* Forgot Password Route */}
        <Route 
          path="/forgot-password" 
          element={
            <div className="flex items-center justify-center min-h-[80vh] px-4">
              <ForgotPasswordForm />
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        {/* Router ඇතුළේ Layout Component එක render කරනවා */}
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;