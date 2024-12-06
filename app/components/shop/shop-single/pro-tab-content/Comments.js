import Image from "next/image";
import React, { useEffect, useState } from "react";

const Comments = ({ product, onReviewsCountChange }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!product?._id) return;
        
        const response = await fetch(`http://localhost:5000/reviews/getReviews/${product._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        console.log('Reviews data:', data);
        
        // Ensure data is an array
        const reviewsArray = Array.isArray(data) ? data : [];
        setReviews(reviewsArray);
        
        // Notify parent component about the number of reviews
        onReviewsCountChange?.(reviewsArray.length);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [product?._id, onReviewsCountChange]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;
  if (!reviews.length) return <div>No reviews yet</div>;

  return (
    <>
      {reviews.map((comment, index) => (
        <div className="single-comment" key={index}>
          <div className="mbp_first d-flex align-items-center">
            <div className="flex-shrink-0">
              <div style={{ 
                borderRadius: '50%', 
                overflow: 'hidden',
                width: '70px',
                height: '70px',
                position: 'relative'
              }}>
                <Image
                  width={70}
                  height={70}
                  src={comment.profilePictureUrl || "/images/blog/unknown.webp"}
                  className="mr-3"
                  alt={comment.name}
                  style={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            </div>
            <div className="flex-grow-1 ms-4">
              <h4 className="sub_title mt20">{comment.name}</h4>
              <div className="sspd_postdate mb15">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                <div className="sspd_review float-end">
                  <ul className="mb0 pl15">
                    {[...Array(5)].map((_, i) => (
                      <li className="list-inline-item" key={i}>
                        <a href="#">
                          <i className={`fa fa-star${i < comment.rating ? '' : '-o'}`} />
                        </a>
                      </li>
                    ))}
                    <li className="list-inline-item">({comment.rating} reviews)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="mt15 mb30">{comment.review}</p>
          {index !== reviews.length - 1 && <hr />}
        </div>
      ))}
    </>
  );
};

export default Comments;
