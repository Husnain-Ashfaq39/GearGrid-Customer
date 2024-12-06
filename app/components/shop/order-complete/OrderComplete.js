'use client'
/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from 'react';
import useOrderStore from '@/utils/store/useOrderStore'; // Import the order store

const OrderComplete = () => {
  const order = useOrderStore((state) => state.order); // Get the order from the store
  console.log('order '+JSON.stringify(order));
  

  useEffect(() => {
    const storeOrderData = async () => {
      if (order) {
        
        try {
          // Call your backend API to store the order data
          const response = await fetch('http://localhost:5001/orders/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
          });

          if (!response.ok) {
            console.error('Failed to store order data:', await response.json());
          }
        } catch (error) {
          console.error('Error storing order data:', error);
        }
      }
    };

    storeOrderData();
  }, [order]); // Run effect when order changes

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="order_complete_message text-center">
            <div className="icon">
              <span className="fa fa-check text-white" />
            </div>
            <h2 className="title">Your order is completed!</h2>
            <p className="para">Thank you. Your order has been received.</p>
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="row">
        <div className="col-xl-7 m-auto">
          <div className="shop_order_box">
            <div className="order_list_raw text-center">
              <ul>
                <li className="list-inline-item">
                  <p>Order Number</p>
                  <h5>{order?.transactionId || 'N/A'}</h5> {/* Display Order Number */}
                </li>
                <li className="list-inline-item">
                  <p>Date</p>
                  <h5>{new Date().toLocaleDateString()}</h5> {/* Display current date */}
                </li>
                <li className="list-inline-item">
                  <p>Total</p>
                  <h5>${order?.totalPrice || '0.00'}</h5> {/* Display Total Price */}
                </li>
                <li className="list-inline-item">
                  <p>Payment Method</p>
                  <h5>{order?.paymentMethod || 'N/A'}</h5> {/* Display Payment Method */}
                </li>
              </ul>
            </div>
            <div className="order_details">
              <h4 className="title mb40">Order details</h4>
              <div className="od_content">
                <ul>
                  <li className="subtitle bb1 mb20 pb5">
                    <p>
                      Product <span className="float-end">Subtotal</span>
                    </p>
                  </li>
                  {/* You can add more product details here if needed */}
                  <li>
                    <p className="product_name_qnt">
                      {order?.productName || 'Product Name'} x {order?.quantity || 1} <span className="float-end">${order?.totalPrice || '0.00'}</span>
                    </p>
                  </li>
                  <li className="subtitle">
                    <p>
                      Total <span className="float-end totals">${order?.totalPrice || '0.00'}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default OrderComplete;
