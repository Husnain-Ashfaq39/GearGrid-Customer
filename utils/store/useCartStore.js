import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],

      addToCart: (product) =>
        set((state) => {
          

          // Check if the item is already in the cart
          const existingItem = state.cartItems.find(
            (item) => item._id === product._id
          );

          // If item exists, update its quantity
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 } // Increment quantity
                  : item
              ),
            };
          }

          // If item doesn't exist in the cart, add it with quantity 1
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          // Remove item from the cart by its `id`
          cartItems: state.cartItems.filter((item) => item._id !== id),
        })),

      clearCart: () => set({ cartItems: [] }), // Clear the entire cart
    }),
    {
      name: 'cart-storage', // The storage key in localStorage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useCartStore;
