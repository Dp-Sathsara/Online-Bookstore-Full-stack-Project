import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BOOKS, type Book } from '@/data/books';

interface BookStore {
    books: Book[];
    addBook: (book: Omit<Book, 'id'>) => void;
    updateBook: (id: number, updates: Partial<Book>) => void;
    deleteBook: (id: number) => void;
}

export const useBookStore = create<BookStore>()(
    persist(
        (set) => ({
            books: BOOKS, // Initialize with default data
            addBook: (book) => set((state) => {
                const newId = Math.max(...state.books.map((b) => b.id), 0) + 1;
                return { books: [{ ...book, id: newId }, ...state.books] };
            }),
            updateBook: (id, updates) => set((state) => ({
                books: state.books.map((book) => (book.id === id ? { ...book, ...updates } : book)),
            })),
            deleteBook: (id) => set((state) => ({
                books: state.books.filter((book) => book.id !== id),
            })),
        }),
        {
            name: 'book-storage', // unique name
        }
    )
);
