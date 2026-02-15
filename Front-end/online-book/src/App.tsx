import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import CheckoutPage from "./components/CheckoutPage";

// ✅ User Pages & Components
import Navbar from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import BookDetails from "./components/BookDetails";
import CategoryPage from "./components/CategoryPage";
import ProfileSettings from "./components/ProfileSettings";
import MyOrders from "./components/MyOrders";
import Footer from "./components/Footer";
import Home from "./pages/Home"; // ✅ Import Home Page
import BrowseCollection from "./pages/BrowseCollection"; // ✅ Import Browse Collection Page
import CategoriesPage from "./pages/CategoriesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ContactPage from "./pages/ContactPage";

// ✅ Admin Components & Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminInventory from "./components/admin/AdminInventory";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminUsers from "./components/admin/AdminUsers";
import AdminReviews from "./components/admin/AdminReviews";
import AdminArticles from "./components/admin/AdminArticles";
import AdminContactMessages from "./components/admin/AdminContactMessages";
import AdminAnnotuncements from "./components/admin/AdminMessages"; // Placeholder until created
import AdminFAQ from "./components/admin/AdminFAQ"; // Placeholder until created
import FAQPage from "./pages/FAQPage"; // Placeholder until created
import MessagesPage from "./pages/MessagesPage"; // Placeholder until created

import ScrollToTop from "./components/ScrollToTop"; // ✅ Import ScrollToTop

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ✅ Navbar සහ Footer පෙන්විය යුතුද යන්න තීරණය කිරීම
  const shouldShowHeaderFooter = !hideNavbarRoutes.includes(location.pathname) && !isAdminRoute;

  // Handle hash scrolling for Browse Collection interaction
  useEffect(() => {
    if (location.hash === '#browse-collection') {
      const element = document.getElementById('browse-collection');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'bg-background' : 'bg-gradient-to-br from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-black'} text-foreground transition-colors duration-300 font-sans`}>

      {/* Scroll To Top */}
      <ScrollToTop />

      {/* Navbar එක පෙන්වීම */}
      {shouldShowHeaderFooter && <Navbar setSearchQuery={() => { }} />}

      {/* ප්‍රධාන Content එක */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse-collection" element={<BrowseCollection />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/messages" element={<MessagesPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/inventory" element={<AdminLayout><AdminInventory /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><AdminAnnotuncements /></AdminLayout>} />
          <Route path="/admin/faq" element={<AdminLayout><AdminFAQ /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
          <Route path="/admin/articles" element={<AdminLayout><AdminArticles /></AdminLayout>} />
          <Route path="/admin/contacts" element={<AdminLayout><AdminContactMessages /></AdminLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><LoginForm /></div>} />
          <Route path="/register" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><RegisterForm /></div>} />
          <Route path="/forgot-password" element={<div className="flex items-center justify-center min-h-[80vh] px-4"><ForgotPasswordForm /></div>} />
        </Routes>
      </div>

      {/* Footer එක පෙන්වීම (Navbar පේන පේජ් වලට පමණක්) */}
      {shouldShowHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;