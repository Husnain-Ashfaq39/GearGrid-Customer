/* eslint-disable react/prop-types */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/utils/store/useCartStore";
import { FaMicrophone } from 'react-icons/fa';

const Products = ({ 
  filter, 
  categoryFilter, 
  searchTerm, 
  currentPage, 
  itemsPerPage,
  onTotalPagesChange 
}) => {
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Only fetch once when component mounts

  // Apply filters and search
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter.length > 0) {
      result = result.filter(product => 
        categoryFilter.includes(product.categoryId)
      );
    }

    // Apply sorting
    if (filter && filter !== "default") {
      switch (filter) {
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "recent":
          // Assuming products have a createdAt field
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    }

    // Update total count and filtered products
    setTotalCount(result.length);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredProducts(result.slice(startIndex, endIndex));
    
    // Update total pages
    onTotalPagesChange(Math.ceil(result.length / itemsPerPage));
  }, [products, searchTerm, filter, categoryFilter, currentPage, itemsPerPage, onTotalPagesChange]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (filteredProducts.length === 0) {
    return <div className="text-center mt-10">No products found.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div className="shop_item" key={product._id}>
            <div className="relative">
              {product.isOnSale && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  ON SALE
                </span>
              )}
              {product.bannerLabel && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full uppercase">
                  {product.bannerLabel}
                </span>
              )}
              <Link href={`/shop-single/${product._id}`} className="block">
                <div className="thumb">
                  {product.images && product.images[0] && (
                    <Image
                      width={284}
                      height={183}
                      className="img-fluid w-100 h-100 object-cover"
                      src={product.images[0]}
                      alt={product.name}
                    />
                  )}
                </div>
              </Link>
              <div className="details">
                <div className="title">
                  <Link href={`/shop-single/${product._id}`}>
                    <h5>{product.name}</h5>
                  </Link>
                  <span className="price">
                    <small>
                      <del>{product.oldPrice && `$${product.oldPrice}`}</del>
                    </small>
                    ${product.price}
                  </span>
                </div>
                <div className="cart_btns">
                  <button
                    onClick={() => addToCart(product)}
                    className="cart_btn_1"
                    aria-label="Add to cart"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
