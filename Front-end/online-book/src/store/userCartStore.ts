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
  selected: boolean; // 👈 අලුතින් එකතු කළා
}

interface CartStore {
  cart: CartItem[];
  addToCart: (book: Book, qty?: number) => void;
  removeFromCart: (id: number) => void;
  removeItemCompletely: (id: number) => void;
  toggleSelectItem: (id: number) => void; // 👈 එකක් තෝරන්න
  toggleSelectAll: (isSelected: boolean) => void; // 👈 ඔක්කොම තෝරන්න
  clearSelectedItems: () => void; // 👈 Checkout වූ ඒවා පමණක් ඉවත් කරන්න
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
          // අලුතින් add වෙද්දී selected true විදියටම එනවා
          set({ cart: [...currentCart, { ...book, quantity: qty, selected: true }] });
        }
      },

      toggleSelectItem: (id) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      })),

      toggleSelectAll: (isSelected) => set((state) => ({
        cart: state.cart.map((item) => ({ ...item, selected: isSelected }))
      })),

      clearSelectedItems: () => set((state) => ({
        cart: state.cart.filter((item) => !item.selected)
      })),

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
        // ✅ තෝරාගත් (Selected) ඒවායේ මුදල පමණක් ගණනය කරයි
        return get().cart
          .filter(item => item.selected)
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'user-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);