export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  description: string;
  rating: number; // string නොවී number එකක්ම තැබුවා
  soldCount: number;
  isChoice: boolean;
  keywords: string[];
}

export const BOOKS: Book[] = Array.from({ length: 28 }, (_, i) => {
  const titles = ["The Great Gatsby", "Atomic Habits", "Deep Work", "Rich Dad Poor Dad"];
  const authors = ["F. Scott Fitzgerald", "James Clear", "Cal Newport", "Robert Kiyosaki"];
  const categories = ["Fiction", "Self-Help", "Productivity", "Finance"];
  
  const title = titles[i % 4];
  const author = authors[i % 4];
  const category = categories[i % 4];

  // AliExpress Style මිල ගණන් (Discount එකක් පෙනෙන විදියට)
  const originalPrice = i % 4 === 0 ? 1800 : i % 4 === 1 ? 2800 : i % 4 === 2 ? 2400 : 2000;
  const currentPrice = i % 4 === 0 ? 1250 : i % 4 === 1 ? 2100 : i % 4 === 2 ? 1850 : 1500;

  return {
    id: i + 1,
    title,
    author,
    originalPrice, 
    price: currentPrice, 
    category,
    image: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80`,
    description: `Detailed description for ${title} by ${author}. This book is an essential read in the ${category} category, providing deep insights and valuable knowledge.`,
    
    // ✅ Typescript වලට ගැලපෙන ලෙස number values ලබා දීම
    rating: 4.5 + (Math.random() * 0.5), // 4.5 - 5.0 අතර number එකක්
    soldCount: Math.floor(Math.random() * 5000) + 120, 
    isChoice: i % 3 === 0, 
    
    keywords: [title.toLowerCase(), author.toLowerCase(), category.toLowerCase(), "book"]
  };
});