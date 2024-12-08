"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useWishlistStore from "@/utils/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import useUserStore from "@/utils/store/userStore";
import { useRouter } from 'next/navigation';

/**
 * @typedef {Object} WishlistItem
 * @property {string} _id
 * @property {string[]} images
 * @property {string} name
 * @property {number} price
 * @property {number} [discountPrice]
 * @property {number} stockQuantity
 * @property {number} lowStockAlert
 * @property {string[]} tags
 * @property {string} categoryId
 * @property {boolean} isOnSale
 * @property {string} [bannerLabel]
 */

const CarItems = () => {
  const { wishlist, loading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useUserStore();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          console.log('Starting wishlist fetch for user:', user._id);
          const data = await fetchWishlist();
          console.log('Wishlist fetch completed. Data:', data);
          setIsInitialLoad(false);
        } catch (err) {
          console.error('Error in loadWishlist:', err);
          setIsInitialLoad(false);
        }
      } else {
        console.log('No user found, skipping wishlist fetch');
      }
    };

    loadWishlist();
  }, [user, fetchWishlist]);

  useEffect(() => {
    console.log('Wishlist state updated:', {
      isArray: Array.isArray(wishlist),
      length: wishlist?.length,
      content: wishlist
    });
  }, [wishlist]);

  useEffect(() => {
    console.log('Current wishlist state:', wishlist);
  }, [wishlist]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      if (error.message.includes('login')) {
        router.push('/login');
      } else {
        toast.error(error.message || 'Failed to remove item');
      }
    }
  };

  if (isInitialLoad && loading) {
    return (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="col-12 text-center py-5">
        <h3 className="text-muted">Please login to view your wishlist</h3>
        <Link href="/login" className="btn btn-thm mt-3">
          Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12 text-center py-5">
        <h3 className="text-danger">{error}</h3>
        {error.includes('login') && (
          <Link href="/login" className="btn btn-thm mt-3">
            Login
          </Link>
        )}
      </div>
    );
  }

  // Ensure wishlist is an array and has items
  const wishlistItems = Array.isArray(wishlist) ? wishlist : [];

  if (wishlistItems.length === 0) {
    return (
      <div className="col-12 text-center py-5">
        <h3 className="text-muted">Your wishlist is empty</h3>
        <Link href="/shop" className="btn btn-thm mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row">
      <AnimatePresence>
        {wishlistItems.map((item) => {
          // Ensure we have a valid image URL
          const imageUrl = Array.isArray(item.images) && item.images.length > 0 
            ? item.images[0] 
            : '/placeholder-image.jpg'; // Add a placeholder image

          return (
            <motion.div
              key={item._id}
              className="col-sm-6 col-xl-12 col-xxl-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="car-listing list_style hover:shadow-lg transition-shadow duration-300">
                <div className="thumb relative group">
                  <Link href={`/shop-single/${item._id}`}>
                    <Image
                      width={260}
                      height={167}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      priority
                      src={imageUrl}
                      alt={item.name || 'Product image'}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  {item.bannerLabel && (
                    <div className="banner-label absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded">
                      {item.bannerLabel}
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-md shadow-md transition-all duration-300 hover:scale-110 group"
                    title="Remove from wishlist"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>

                <div className="details p-4">
                  <div className="wrapper">
                    <div className="price-wrapper flex items-center gap-2">
                      <h5 className="price text-primary">${item.discountPrice || item.price}</h5>
                      {item.discountPrice && (
                        <small>
                          <del className="text-muted">${item.price}</del>
                        </small>
                      )}
                    </div>
                    <h6 className="title">
                      <Link 
                        href={`/shop-single/${item._id}`}
                        className="hover:text-primary transition-colors duration-300"
                      >
                        {item.name}
                      </Link>
                    </h6>
                    {item.stockQuantity <= item.lowStockAlert && (
                      <div className="text-warning text-sm mt-1">
                        Only {item.stockQuantity} left in stock!
                      </div>
                    )}
                    <div className="tags mt-2">
                      {item.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="listing_footer mt-3">
                    <ul className="mb0 flex items-center gap-4">
                      <li className="flex items-center">
                        <span className="flaticon-tag me-2" />
                        {item.categoryId}
                      </li>
                      {item.isOnSale && (
                        <li className="flex items-center text-green-500">
                          <span className="flaticon-price-tag me-2" />
                          On Sale
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CarItems;
