'use client';
import Image from "next/image";
import React, { useState } from "react";
import useCartStore from "@/utils/store/useCartStore"; // Import Zustand store
import { add } from "date-fns";

const SingleProDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore(); // Get addToCart function from Zustand

  const handleQuantityChange = (e, _id) => {
    const inputQuantity = parseInt(e.target.value, 10) || 1;
  
    const item = cartItems.find(item => item._id === _id);
    const stockQuantity = item ? item.stockQuantity : 0;
  
    // Ensure quantity does not exceed stock
    if (inputQuantity > stockQuantity) {
      alert(`Only ${stockQuantity} items are available in stock.`);
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: stockQuantity } : item
        ),
      }));
    } else if (inputQuantity < 1) {
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: 1 } : item
        ),
      }));
    } else {
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: inputQuantity } : item
        ),
      }));
    }
  };
  

  const handleAddToCart = () => {
    if (quantity > product?.stockQuantity) {
      alert(`Only ${product.stockQuantity} items are available in stock.`);
    } else {
      // const productToAdd = { ...product, quantity }; // Include quantity directly
     addToCart(product); // Pass the product directly
     console.log(product);
      alert(`${product?.name} added to cart!`);
    }
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
          <ul className="cart_btns wishlist_compare mb20">
            <li className="list-inline-item">
              <button
                type="button"
                className="btn btn-thm"
                onClick={()=>handleAddToCart()} // Add to cart functionality
              >
                <img
                  className="mr10"
                  src="/images/shop/cart-bag.svg"
                  alt="cart-bag.svg"
                />
                Add to Cart
              </button>
            </li>
            <li className="list-inline-item">
              <a href="#" className="favorite_icon">
                <span className="flaticon-heart" />
              </a>
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
