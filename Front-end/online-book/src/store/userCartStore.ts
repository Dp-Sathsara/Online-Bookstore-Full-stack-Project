import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
}

interface CartItem extends Book {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (book: Book, qty?: number) => void; // qty එකක් එවන්නත් පුළුවන් විදියට හැදුවා
  removeFromCart: (id: number) => void;
  removeItemCompletely: (id: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (book, qty = 1) => {
        const currentCart = get().cart;
        const isBookInCart = currentCart.find((item) => item.id === book.id);

        if (isBookInCart) {
          set({
            cart: currentCart.map((item) =>
              item.id === book.id ? { ...item, quantity: item.quantity + qty } : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...book, quantity: qty }] });
        }
      },

      removeFromCart: (id) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === id);

        if (existingItem && existingItem.quantity > 1) {
          set({
            cart: currentCart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else {
          set({ cart: currentCart.filter((item) => item.id !== id) });
        }
      },

      removeItemCompletely: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ cart: [] }),

      totalPrice: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'user-cart-storage', // LocalStorage එකේ මේ නමින් සේව් වෙන්නේ
      storage: createJSONStorage(() => localStorage),
    }
  )
);