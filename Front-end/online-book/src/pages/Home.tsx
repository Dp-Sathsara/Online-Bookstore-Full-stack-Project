import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";

// 1. BOOKS array එක (Data Source එක)
// මේක Navbar එකටත් පාවිච්චි කරන්න ඕන නිසා export කරලා තියෙන්නේ.
export const BOOKS = Array.from({ length: 28 }, (_, i) => {
  const titles = ["The Great Gatsby", "Atomic Habits", "Deep Work", "Rich Dad Poor Dad", "Ape Gama"];
  const authors = ["F. Scott Fitzgerald", "James Clear", "Cal Newport", "Robert Kiyosaki", "Martin Wickramasinghe"];
  const title = titles[i % 5];
  const author = authors[i % 5];
  
  return {
    id: i + 1,
    title,
    author,
    price: i % 5 === 0 ? 1250 : i % 5 === 1 ? 2100 : i % 5 === 2 ? 1850 : 1500,
    category: i % 5 === 0 ? "Fiction" : i % 5 === 1 ? "Self-Help" : i % 5 === 2 ? "Productivity" : i % 5 === 3 ? "Finance" : "Literature",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    keywords: [
      title.toLowerCase(), 
      author.toLowerCase(), 
      title === "Ape Gama" ? "අපේ ගම" : "",
      title === "Ape Gama" ? "the village" : ""
    ].filter(Boolean)
  };
});

const Home = () => {
  // සර්ච් එක Navbar එකේ handle වෙන නිසා මෙතන filter logic අවශ්‍ය නැහැ.
  // මේ පේජ් එක හැමතිස්සෙම Clean එකට Featured Books විතරක් පෙන්වනවා.
  
  return (
    <div className="bg-background min-h-screen">
      {/* 1. Hero Section - ඔයා එවපු අලුත් Design එක */}
      <Hero />

      {/* 2. Featured Books Section */}
      <main className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b pb-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Featured Books
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Explore our latest collection of handpicked books.
            </p>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 animate-in fade-in duration-700">
          {BOOKS.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;