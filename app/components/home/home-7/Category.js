"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70"
    aria-label="Next"
  >
    <IoChevronForwardOutline className="w-6 h-6 text-white" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70"
    aria-label="Previous"
  >
    <IoChevronBackOutline className="w-6 h-6 text-white" />
  </button>
);

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/categories/all`
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error:", err);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          centerPadding: '40px'
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          centerPadding: '40px'
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          centerPadding: '30px'
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px'
        }
      }
    ]
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="category-slider px-6">
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category._id} className="px-2">
            <Link href={`/shop?category=${category._id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-all mx-auto" style={{ maxWidth: '220px' }}>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={category.image?.[0] || '/images/placeholder.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-medium text-gray-800 truncate">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Category;