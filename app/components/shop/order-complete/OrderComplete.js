'use client'
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import useOrderStore from '@/utils/store/useOrderStore'; // Import the order store
import useCartStore from '@/utils/store/useCartStore'; // Import the cart store
import axios from 'axios'; // Ensure axios is imported

const OrderComplete = () => {
  const order = useOrderStore((state) => state.order); // Get the order from the store
  const cartItems = useCartStore((state) => state.cartItems); // Get cart items from the store
  const clearCart = useCartStore((state) => state.clearCart);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  // Local state to store the data for display purposes
  const [localOrder, setLocalOrder] = useState(order);
  const [localCartItems, setLocalCartItems] = useState(cartItems);

  const [isDataStored, setIsDataStored] = useState(false);

  useEffect(() => {
    const storeOrderData = async () => {
      if (order) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/orders/add`, order, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log("Response adding Order " + JSON.stringify(response));

          if (response) {
            // New code to store order items
            await Promise.all(cartItems.map(async (item) => {
              const orderItem = {
                orderId: response.data._id,
                productId: item._id,
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
                description: item.description || '',
                categoryId: item.categoryId,
                images: item.images || [],
                tags: item.tags || [],
                isOnSale: item.isOnSale || false
              };

              await axios.post(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/orderitems/add`, orderItem, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            }));

            // Set the local state with order data
            setLocalOrder(response.data);
            setLocalCartItems(cartItems);

            // Flag to clear the store after UI renders
            setIsDataStored(true);
          } else {
            console.error('Failed to store order data:', response.data);
          }
        } catch (error) {
          console.error('Error storing order data:', error);
        }
      }
    };

    storeOrderData();
  }, [order, cartItems]);

  // Only clear the stores if the data is fully stored
  useEffect(() => {
    if (isDataStored) {
      clearCart();
      clearOrder();
    }
  }, [isDataStored]);

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
                  <h5>{localOrder?.transactionId || 'N/A'}</h5> {/* Display Order Number */}
                </li>
                <li className="list-inline-item">
                  <p>Date</p>
                  <h5>{new Date().toLocaleDateString()}</h5> {/* Display current date */}
                </li>
                <li className="list-inline-item">
                  <p>Total</p>
                  <h5>${localOrder?.totalPrice || '0.00'}</h5> {/* Display Total Price */}
                </li>
                <li className="list-inline-item">
                  <p>Payment Method</p>
                  <h5>{localOrder?.paymentMethod || 'N/A'}</h5> {/* Display Payment Method */}
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
                  {localCartItems.map((item) => (
                    <li key={item._id}>
                      <p className="product_name_qnt">
                        {item.name} x {item.quantity} <span className="float-end">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </li>
                  ))}
                  <li className="subtitle">
                    <p>
                      Total <span className="float-end totals">${localCartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
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
