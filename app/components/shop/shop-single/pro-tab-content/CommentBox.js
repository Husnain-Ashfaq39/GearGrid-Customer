"use client";
import React, { useState } from "react";
import useUserStore from "@/utils/store/userStore";

const CommentBox = ({ product }) => {
  const user = useUserStore((state) => state.user);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        userId: user._id,
        productId: product._id,
        rating: rating,
        review: review.trim()
      };

      console.log('Submitting review:', reviewData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/reviews/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const data = await response.json();
      console.log('Review submitted successfully:', data);

      // Clear form
      setRating(0);
      setReview("");
      setError("");

      // Show success message
      alert("Review submitted successfully!");

    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comments_form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12">
          <h5 className="fz16 mb30">Write a review</h5>
          <div className="sspd_review mb30">
            <ul className="mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <li className="list-inline-item" key={star}>
                  <button
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={() => handleStarHover(0)}
                    className="border-0 bg-transparent p-0"
                  >
                    <i 
                      className={`fa fa-star ${
                        star <= (hoveredRating || rating) ? 'text-warning' : 'text-muted'
                      }`} 
                    />
                  </button>
                </li>
              ))}
            </ul>
            {rating > 0 && (
              <small className="text-muted">Selected rating: {rating} stars</small>
            )}
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <textarea
              className="form-control form_control"
              rows={6}
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="col-md-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <div className="col-md-12">
          <button 
            type="submit" 
            className="btn btn-thm" 
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentBox;
