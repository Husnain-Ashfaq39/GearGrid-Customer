'use client'
/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from 'react';
import useOrderStore from '@/utils/store/useOrderStore'; // Import the order store
import useCartStore from '@/utils/store/useCartStore'; // Import the cart store
import axios from 'axios'; // Ensure axios is imported
const OrderComplete = () => {
  const order = useOrderStore((state) => state.order); // Get the order from the store
  const cartItems = useCartStore((state) => state.cartItems); // Get cart items from the store
  console.log('order ' + JSON.stringify(order));
  
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
                orderId: response.data._id, // Assuming transactionId is the orderId
                productId: item._id,
                productName: item.name, // Adjust according to your product structure
                quantity: item.quantity,
                price: item.price, // Adjust according to your product structure
                subtotal: item.price * item.quantity,
                description: item.description || '', // Adjust according to your product structure
                categoryId: item.categoryId, // Adjust according to your product structure
                images: item.images || [], // Adjust according to your product structure
                tags: item.tags || [], // Adjust according to your product structure
                isOnSale: item.isOnSale || false // Adjust according to your product structure
              };
              console.log('order item ' + JSON.stringify(orderItem));
              
              await axios.post(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/orderitems/add`, orderItem, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            }));
            // Clear both stores after successful order and order items storage
            useOrderStore.setState({ order: null });
            useCartStore.setState({ cartItems: [] });
          } else {
            console.error('Failed to store order data:', response.data);
          }
        } catch (error) {
          console.error('Error storing order data:', error);
        }
      }
    };

    storeOrderData();
  }, [order, cartItems]); // Added cartItems to the dependency array

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
                  {cartItems.map((item) => (
                    <li key={item._id}>
                      <p className="product_name_qnt">
                        {item.name} x {item.quantity} <span className="float-end">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </li>
                  ))}
                  <li className="subtitle">
                    <p>
                      Total <span className="float-end totals">${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
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
