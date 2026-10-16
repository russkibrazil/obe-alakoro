import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AnonymousCartProduct {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  stock: number;
}

export interface AnonymousCartItem {
  productId: string;
  quantity: number;
  product: AnonymousCartProduct;
}

interface AnonymousCartState {
  items: AnonymousCartItem[];

  addItem: (product: AnonymousCartProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useAnonymousCartStore = create<AnonymousCartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product: AnonymousCartProduct, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item: AnonymousCartItem) => item.productId === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item: AnonymousCartItem) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      product,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                product,
              },
            ],
          };
        }),

      updateQuantity: (productId: string, quantity: number) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item: AnonymousCartItem) => item.productId !== productId
                )
              : state.items.map((item: AnonymousCartItem) =>
                  item.productId === productId
                    ? { ...item, quantity }
                    : item
                ),
        })),

      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter(
            (item: AnonymousCartItem) => item.productId !== productId
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'anonymous-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);