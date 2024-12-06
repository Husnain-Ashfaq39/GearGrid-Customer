'use client';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useCartStore from "@/utils/store/useCartStore";

const RelatedProducts = ({productId}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!productId) return;

        const response = await fetch(`http://localhost:5000/api/products/related/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product);
    // Optional: Add some visual feedback
    alert('Product added to cart!');
  };

  if (loading) return <div>Loading related products...</div>;
  if (error) return <div>Error loading related products: {error}</div>;
  if (!products.length) return null;

  return (
    <>
      <Swiper
        spaceBetween={20}
        speed={1000}
        modules={[Pagination]}
        pagination={{
          el: ".shop-related-pagination",
          spaceBetween: 10,
          clickable: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1068: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="item" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
              <div className="shop_item" style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
                <Link href={`/shop-single/${product._id}`} className="thumb" style={{ 
                  width: '100%', 
                  height: '300px', 
                  position: 'relative',
                  display: 'block',
                  overflow: 'hidden'
                }}>
                  <Image
                    fill
                    src={product.images?.[0] || "/images/shop/1.png"}
                    alt={product.name}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 300px) 100vw, 300px"
                  />
                </Link>
                <div className="details" style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="title" style={{ marginBottom: '10px' }}>
                      <Link href={`/shop-single/${product._id}`}>{product.name}</Link>
                    </div>
                    <div className="review">
                      <ul className="mb0">
                        {[...Array(5)].map((_, index) => (
                          <li className="list-inline-item" key={index}>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                        ))}
                        <li className="list-inline-item">4.7</li>
                      </ul>
                    </div>
                  </div>

                  <div className="si_footer">
                    <div className="price float-start">
                      {product.discountPrice && (
                        <small>
                          <del>${product.price}</del>
                        </small>
                      )}
                      ${product.discountPrice || product.price}
                    </div>
                    <a 
                      href="#" 
                      onClick={(e) => handleAddToCart(e, product)} 
                      className="cart_btn float-end"
                      style={{ cursor: 'pointer' }}
                    >
                      <Image
                        width={12}
                        height={14}
                        src="/images/shop/cart-bag.svg"
                        alt="cart-bag.svg"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-3 text-center">
        <div className="shop-related-pagination" />
      </div>
    </>
  );
};

export default RelatedProducts;
