"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const RecentPost = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/products/trending`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger p-4">{error}</div>;
  }

  return (
    <div className="recent-posts">
      {products.map((product) => (
        <Link 
          href={`/shop-single/${product._id}`} 
          key={product._id}
          className="text-decoration-none"
        >
          <div className="recent-post-item d-flex align-items-center p-3 mb-3 rounded transition-all hover:bg-gray-50">
            <div className="flex-shrink-0 me-3">
              <div className="image-wrapper rounded-2 overflow-hidden" style={{ width: '80px', height: '80px' }}>
                <Image
                  width={80}
                  height={80}
                  className="w-100 h-100 object-cover transition-transform hover:scale-110"
                  src={product.images[0]}
                  alt={product.name}
                />
              </div>
            </div>
            <div className="flex-grow-1">
              <h6 className="product-title mb-1 text-dark hover:text-primary transition-colors">
                {product.name}
              </h6>
              <div className="price-wrapper">
                <span className="current-price fw-bold text-primary">
                  ${product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span className="original-price text-decoration-line-through ms-2 text-muted small">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentPost;
