'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useCartStore from "@/utils/store/useCartStore"; 
import useWishlistStore from "@/utils/store/useWishlistStore";
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";

const SingleProDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore(); 
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (product && wishlist) {
      setIsInWishlist(wishlist.some(item => item.id === product.id));
    }
  }, [product, wishlist]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity,
      });
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-gradient-to-r from-blue-500 to-white p-4 rounded-lg shadow-lg flex items-center gap-3"
        >
          <div className="text-white">Added to cart successfully!</div>
        </motion.div>
      ));
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    let success;
    if (isInWishlist) {
      success = await removeFromWishlist(product.id);
      if (success) {
        setIsInWishlist(false);
        showToast('Removed from wishlist');
      }
    } else {
      console.log('step 1 of adding to wishlist '+ JSON.stringify(product._id));
      
      success = await addToWishlist(product._id);
      if (success) {
        setIsInWishlist(true);
        showToast('Added to wishlist');
      }
    }
  };

  const showToast = (message) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-gradient-to-r from-blue-500 to-white p-4 rounded-lg shadow-lg flex items-center gap-3"
      >
        <div className="text-white">{message}</div>
      </motion.div>
    ));
  };

  return (
    <>
      <div className="col-lg-6 mb-5">
        <div className="single_product_grid">
          <div className="sps_content">
            <div className="thumb">
              <Image
                width={508}
                height={508}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                className="img-fluid"
                src={product?.images?.[0] || "/images/shop/ss1.png"}
                alt={product?.name || "Product Image"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="shop_single_product_details p0-414">
          <h3 className="title">{product?.name || "Unnamed Product"}</h3>
          <p
            className="mb25"
            dangerouslySetInnerHTML={{
              __html: product?.description || "No description available.",
            }}
          />
          <div className="sspd_price mb30">
            ${product?.price}
            {product?.discountPrice && (
              <small>
                <del className="ml10">${product.discountPrice}</del>
              </small>
            )}
          </div>
          <ul className="cart_btns instock_area mb30">
            <li className="list-inline-item">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product?.stockQuantity || 1}
              />
            </li>
            <li className="list-inline-item">
              <span className="fa fa-check-circle text-thm3 ml10 mr5 fz18" />{" "}
              {product?.stockQuantity || 0} in stock
            </li>
          </ul>
          <ul className="cart_btns wishlist_compare mb20" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <li className="list-inline-item" style={{ width: '200px' }}>
              <button
                type="button"
                className="btn btn-thm w-100"
                style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={()=>handleAddToCart()} // Add to cart functionality
              >
                <img
                  src="/images/shop/cart-bag.svg"
                  alt="cart-bag.svg"
                />
                Add to Cart
              </button>
            </li>
            <li className="list-inline-item">
              <button
                onClick={handleWishlist}
                className="favorite_icon btn"
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isInWishlist ? '#1a3760' : '#fff',
                  border: isInWishlist ? 'none' : '1px solid #1a3760',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <i 
                  className="flaticon-heart"
                  style={{ 
                    color: isInWishlist ? '#fff' : '#1a3760',
                    fontSize: '20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </button>
            </li>
          </ul>
          <ul className="sspd_sku">
            <li>
              <a href="#">SKU:</a> <span>{product?.barcode || "N/A"}</span>
            </li>
            <li>
              <a href="#">Categories:</a>{" "}
              <span>{product?.categoryId || "Uncategorized"}</span>
            </li>
            <li>
              <a href="#">Tags:</a>{" "}
              <span>{product?.tags?.join(", ") || "No tags available"}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SingleProDetails;
