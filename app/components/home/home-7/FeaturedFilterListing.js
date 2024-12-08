"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";
import { FaStar, FaEye, FaShoppingCart, FaBoxOpen } from 'react-icons/fa';

const FeaturedFilterListing = () => {
  const [filter, setFilter] = useState("trending");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = filter === "trending" 
          ? "/api/products/trending"
          : "/api/products/top-rated";
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}${endpoint}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        } inline-block mr-1`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger py-4">{error}</div>;
  }

  return (
    <div className="popular_listing_sliders">
      {/* Nav tabs */}
      <div className="nav nav-tabs justify-content-center">
        <button
          className={filter === "trending" ? "active nav-link" : "nav-link"}
          onClick={() => setFilter("trending")}
        >
          Trending
        </button>

        <button
          className={filter === "top-rated" ? "active nav-link" : "nav-link"}
          onClick={() => setFilter("top-rated")}
        >
          Most Reviewed
        </button>
      </div>

      {/* Products Grid */}
      <div className="row">
        {products.map((product) => (
          <div className="col-sm-6 col-xl-6" key={product._id}>
            <div className="car-listing list_style hover:shadow-lg transition-shadow duration-300">
              <div className="thumb">
                {product.isOnSale && (
                  <div className="tag">SALE</div>
                )}
                {product.bannerLabel && !product.isOnSale && (
                  <div className="tag blue">{product.bannerLabel}</div>
                )}

                <Link href={`/shop-single/${product._id}`}>
                  <Image
                    width={284}
                    height={183}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    priority
                    src={product.images[0]}
                    alt={product.name}
                  />
                </Link>

                <div className="thmb_cntnt2">
                  <ul className="mb0">
                    <li className="list-inline-item">
                      <a className="text-white" href="#">
                        <span className="flaticon-photo-camera mr3" />{" "}
                        {product.images.length}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="thmb_cntnt3">
                  <ul className="mb0">
                    <li className="list-inline-item">
                      <a href="#" className="icon-btn hover:bg-primary hover:text-white transition-all duration-300">
                        <FaEye className="text-lg" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="details">
                <div className="wrapper">
                  <h5 className="price">
                    ${product.discountPrice || product.price}
                    {product.discountPrice && (
                      <small className="text-decoration-line-through ms-2">
                        ${product.price}
                      </small>
                    )}
                  </h5>
                  <h6 className="title">
                    <Link href={`/shop-single/${product._id}`}>{product.name}</Link>
                  </h6>
                  
                  <div className="listing_footer">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <span className="d-flex align-items-center">
                          <FaBoxOpen className="me-2 text-primary" />
                          Stock: {product.stockQuantity}
                        </span>
                      </li>
                      {filter === "trending" ? (
                        <li className="list-inline-item">
                          <span className="d-flex align-items-center text-success">
                            <FaShoppingCart className="me-2" />
                            Sold: {product.totalQuantitySold}
                          </span>
                        </li>
                      ) : (
                        <li className="list-inline-item">
                          <div className="d-flex align-items-center">
                            <div className="me-2">{renderStars(product.averageRating)}</div>
                            <span>({product.averageRating})</span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedFilterListing;
