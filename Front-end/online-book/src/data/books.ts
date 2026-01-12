export const BOOKS = Array.from({ length: 28 }, (_, i) => {
  const titles = ["The Great Gatsby", "Atomic Habits", "Deep Work", "Rich Dad Poor Dad"];
  const authors = ["F. Scott Fitzgerald", "James Clear", "Cal Newport", "Robert Kiyosaki"];
  const title = titles[i % 4];
  const author = authors[i % 4];
  
  return {
    id: i + 1,
    title,
    author,
    price: i % 4 === 0 ? 1250 : i % 4 === 1 ? 2100 : i % 4 === 2 ? 1850 : 1500,
    category: i % 4 === 0 ? "Fiction" : i % 4 === 1 ? "Self-Help" : i % 4 === 2 ? "Productivity" : "Finance",
    image: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80`,
    description: "This represents a detailed description of the book. It covers the main themes, the author's background, and why this book is a must-read for enthusiasts of the genre. Perfect for expanding your knowledge.",
    rating: 4.5,
    keywords: [title.toLowerCase(), author.toLowerCase(), "book"]
  };
});