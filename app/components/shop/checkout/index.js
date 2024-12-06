'use client'
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import BillingDetails from "./BillingDetails";
import OrderAmountDetails from "./OrderAmountDetails";
import useOrderStore from '@/utils/store/useOrderStore'; // Import the new order store
import useUserStore from '@/utils/store/userStore'; // Import the user store
import * as yup from 'yup'; // Import yup for validation

// Define a validation schema for billing details
const billingValidationSchema = yup.object().shape({
  customerFirstName: yup.string().required('First name is required'),
  customerLastName: yup.string().required('Last name is required'),
  deliveryCountry: yup.string().required('Country is required'),
  deliveryAddressLine1: yup.string().required('Street address is required'),
  deliveryPostalCode: yup.string().required('Postal code is required'),
  deliveryCity: yup.string().required('City is required'),
  deliveryRegion: yup.string().required('Region is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  // Add other fields as necessary
});

const BillingMain = () => {
  const [billingDetails, setBillingDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default payment method

  const addOrder = useOrderStore((state) => state.addOrder); // Get the addOrder function from the order store
  const userId = useUserStore((state) => state.user?._id); // Get the user ID from the user store

  const handleBillingDetailsChange = (details) => {
    setBillingDetails(details);
  };

  const handleTotalAmountChange = (amount) => {
    setTotalAmount(amount);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate billing details
      await billingValidationSchema.validate(billingDetails, { abortEarly: false });

      // Check if payment method is selected
      if (!paymentMethod) {
        console.error("Payment method is required");
        return;
      }

      const orderData = {
        ...billingDetails,
        totalPrice: totalAmount,
        paymentStatus: 'paid',
        orderStatus: 'pending',
        stripeOrderId: "",
        paymentMethod: paymentMethod,
        transactionId: Math.floor(Math.random() * 1000000000),
        userId: userId
      };
      if (paymentMethod == 'cash') {
        orderData.paymentStatus = 'unpaid'
        addOrder(orderData);
       
        window.open('http://localhost:3000/complete-order');
      }
      else {



        try {
          // Call your backend to create a Stripe checkout session
          console.log('ste 1');
          const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/api/payment/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ totalPrice: Math.round(totalAmount) }),
          });
          console.log('ste 2');

          if (response.ok) {
            const session = await response.json();
            orderData.stripeOrderId = session.session.id;

            addOrder(orderData);
            window.open(session.session.url, '_blank');

          } else {
            // Handle error if backend response is not ok
            console.error('Failed to create Stripe session:', session.error);
          }
        } catch (error) {
          console.error('Error during order processing:', error);
        }
      }
    } catch (error) {
      // Handle validation errors
      const toast = document.createElement('div');
      toast.className = 'fixed top-5 right-5 bg-red-500 text-white p-4 rounded shadow-lg';
      toast.innerText = error;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };

  return (
    <>
      <div className="col-lg-8">
        <div className="checkout_form style2">
          <h4 className="title mb30">Billing details</h4>
          <BillingDetails onBillingDetailsChange={handleBillingDetailsChange} />
        </div>
      </div>
      {/* End billing content */}

      <div className="col-lg-4">
        <div className="order_sidebar_widget mb30">
          <h4 className="title">Your Order</h4>
          <OrderAmountDetails onTotalAmountChange={handleTotalAmountChange} />
        </div>
        {/* End your order */}

        <div className="payment_widget">
          <div className="wrapper">
            <div className="form-check mb20">
              <input
                type="radio"
                name="paymentMethod"
                id="flexRadioDefault1"
                value="stripe"
                defaultChecked={true} // Ensuring Stripe is selected by default
                onChange={handlePaymentMethodChange}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Stripe
              </label>
            </div>
            {/* End form-check */}

            <div className="form-check mb20">
              <input
                type="radio"
                name="paymentMethod"
                id="flexRadioDefault2"
                value="cash"
                onChange={handlePaymentMethodChange}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Cash on delivery
              </label>
            </div>
            {/* End form-check */}
          </div>
        </div>
        <div className="ui_kit_button payment_widget_btn">
          <button
            type="button"
            className="btn btn-thm btn-block"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default BillingMain;
