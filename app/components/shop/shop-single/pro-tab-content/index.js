'use client';
import { useState, useEffect } from 'react';
import CommentBox from "./CommentBox";
import Comments from "./Comments";
import ProductDescripitons from "./ProductDescripitons";
import useUserStore from "@/utils/store/userStore";

const ProductContentTabs = ({ product }) => {
  const [reviewsCount, setReviewsCount] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user || !product) {
        console.log('Missing user or product:', { user, product });
        setCanReview(false);
        setLoading(false);
        return;
      }

      // Get the correct IDs
 
      const userId = user._id;
      const productId = product._id;
      console.log('User ID:', userId);
      console.log('Product ID:', productId);

      // Debug information
      console.log('Debug Info:', {
        userId,
        productId,
        user,
        product,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });

      // Validate IDs
      if (!userId || !productId) {
        console.error('Invalid IDs:', { userId, productId });
        setCanReview(false);
        setLoading(false);
        return;
      }

      try {
        // First check if the API base URL is set
        if (!process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT) {
          throw new Error('API URL is not configured. Please check your .env.local file');
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/reviews/checkPurchase/${userId}/${productId}`;
        console.log('Attempting to fetch:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        console.log('Response:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          url: response.url
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Invalid content type:', contentType);
          console.error('Response body:', responseText);
          throw new Error(`Expected JSON response but got ${contentType}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        
        if (data.success) {
          setCanReview(data.hasPurchased);
        } else {
          console.log('Purchase check returned false:', data);
          setCanReview(false);
        }
      } catch (error) {
        console.error('Error checking purchase status:', {
          error: error.message,
          stack: error.stack
        });
        setCanReview(false);
      } finally {
        setLoading(false);
      }
    };

    checkPurchaseStatus();
  }, [user, product]);

  return (
    <div className="shop_single_tab_content mt40">
      <ul
        className="nav nav-tabs justify-content-center"
        id="myTab2"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="description-tab"
            data-bs-toggle="tab"
            data-bs-target="#description"
            type="button"
            role="tab"
            aria-controls="description"
            aria-selected="true"
          >
            Description
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="reviews-tab"
            data-bs-toggle="tab"
            data-bs-target="#reviews"
            type="button"
            role="tab"
            aria-controls="reviews"
            aria-selected="false"
          >
            Reviews ({reviewsCount})
          </button>
        </li>
      </ul>
      {/* End tabs */}

      <div className="tab-content" id="myTabContent2">
        <div
          className="tab-pane fade show active"
          id="description"
          role="tabpanel"
          aria-labelledby="description-tab"
        >
          <div className="row">
            <div className="col-lg-8 m-auto">
              <ProductDescripitons product={product} />
            </div>
          </div>
        </div>
        {/* End tabs-pane */}

        <div
          className="tab-pane fade"
          id="reviews"
          role="tabpanel"
          aria-labelledby="reviews-tab"
        >
          <div className="row">
            <div className="col-lg-6">
              <div className="shop_single_tab_content mb30-991">
                <div className="product_single_content">
                  <div className="mbp_pagination_comments">
                    <h5 className="fz16 mb30">Reviews</h5>
                    <Comments product={product} onReviewsCountChange={setReviewsCount} />
                  </div>
                </div>
              </div>
            </div>
            {/* End comments col-6 */}

            <div className="col-lg-6">
              <div className="bsp_reveiw_wrt pt30">
                {loading ? (
                  <div>Checking purchase status...</div>
                ) : canReview ? (
                  <CommentBox product={product} />
                ) : user ? (
                  <div className="alert alert-info">
                    You can only review products that you have purchased and received.
                  </div>
                ) : (
                  <div className="alert alert-info">
                    Please log in to write a review.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductContentTabs;
