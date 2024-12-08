import { create } from 'zustand';
import useUserStore from './userStore';

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  setWishlist: (data) => {
    set({ wishlist: data, loading: false, error: null });
  },

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const user = useUserStore.getState().user;
      if (!user) throw new Error('User not found');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/products/wishlist/get-wishlist/${user._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const rawData = await response.json();
      console.log('Raw wishlist response:', rawData);

      if (!response.ok) {
        throw new Error(rawData.message || 'Failed to fetch wishlist');
      }

      // Parse the data if it's a string
      let parsedData;
      try {
        parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      } catch (e) {
        console.error('Error parsing wishlist data:', e);
        parsedData = rawData;
      }

      // Ensure we have an array
      const wishlistData = Array.isArray(parsedData) ? parsedData : [parsedData];
      console.log('Processed wishlist data:', wishlistData);

      // Update the state
      set({ 
        wishlist: wishlistData,
        loading: false,
        error: null 
      });

      return wishlistData;
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      set({ error: error.message, loading: false, wishlist: [] });
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      const user = useUserStore.getState().user;
      if (!user) throw new Error('User not found');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/products/wishlist/add-to-wishlist/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to wishlist');
      }

      // Refresh wishlist after adding
      await get().fetchWishlist();
      return true;
    } catch (error) {
      console.error('Add to wishlist error:', error);
      set({ error: error.message });
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const user = useUserStore.getState().user;
      if (!user) throw new Error('User not found');

      // Optimistically update UI
      const currentWishlist = get().wishlist;
      set({ 
        wishlist: currentWishlist.filter(item => item._id !== productId),
        loading: true 
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/products/wishlist/remove-from-wishlist/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
          })
        }
      );

      if (!response.ok) {
        // Revert optimistic update on error
        set({ 
          wishlist: currentWishlist,
          loading: false,
          error: 'Failed to remove from wishlist'
        });
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from wishlist');
      }

      // Update was successful
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useWishlistStore;
