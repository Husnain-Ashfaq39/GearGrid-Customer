// Products.jsx

/* eslint-disable react/prop-types */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from '@/utils/store/useCartStore'; // Import the Zustand store


const Products = ({ filter, categoryFilter, searchTerm, currentPage, itemsPerPage }) => {
  const { addToCart } = useCartStore(); // Get addToCart function from Zustand store
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm.trim() !== "") {
          queryParams.append("search", searchTerm);
        }
        if (categoryFilter && categoryFilter.length > 0) {
          queryParams.append("categoryId", categoryFilter);
        }

        const response = await fetch(`http://localhost:5001/api/products/all?${queryParams.toString()}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const productsData = await response.json();

        const formattedProducts = productsData.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          imageSrc: product.images.length > 0 ? product.images[0] : "/images/placeholder.png",
          isOnSale: product.isOnSale,
          bannerLabel: product.bannerLabel,
          categoryId: product.categoryId,
          createdAt: product.createdAt,
        }));

        setAllProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, categoryFilter]); // Re-fetch when searchTerm or categoryFilter changes

  useEffect(() => {
    // Filter products based on sort filter
    let sorted = [...allProducts];

    if (filter === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filter === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (filter === "recent") {
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === "default") {
      sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredProducts(sorted);
  }, [allProducts, filter]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (currentProducts.length === 0) {
    return <div className="text-center mt-10">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentProducts.map((product) => (
        <div className="shop_item" key={product.id}>
          <div className="relative">
            {product.isOnSale && (
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                ON SALE
              </span>
            )}
            {product.bannerLabel && (
              <span
                className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full uppercase"
              >
                {product.bannerLabel}
              </span>
            )}
            <Link href={`/shop-single/${product.id}`} className="block">
              <Image
                width={248}
                height={248}
                className="object-cover w-full h-56"
                loading="lazy"
                src={product.imageSrc || "/images/placeholder.png"}
                alt={product.name}
              />
            </Link>
          </div>
          <div className="details mt-4">
            <div className="flex justify-between items-center">
              <div className="price text-lg font-semibold">
                ${product.discountPrice || product.price}
                {product.isOnSale && product.discountPrice && (
                  <del className="ml-2 text-gray-500">${product.price}</del>
                )}
              </div>
              <button 
                onClick={() => addToCart(product)} // Add to cart functionality
                className="cart_btn p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Image
                  width={12}
                  height={14}
                  src="/images/shop/cart-bag.svg"
                  alt="Add to cart"
                />
              </button>
            </div>
            <div className="name mt-2">
              <Link href={`/shop-single/${product.id}`} className="text-gray-800 hover:text-blue-600">
                {product.name}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
