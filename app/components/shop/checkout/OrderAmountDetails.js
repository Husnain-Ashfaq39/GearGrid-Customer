/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
'use client'
import useCartStore from '@/utils/store/useCartStore'; // Ensure correct import
import { useEffect } from 'react';

const OrderAmountDetails = ({ onTotalAmountChange }) => {
  const { cartItems } = useCartStore(); // Access cart items from the store

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

 

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee =10;
    return subtotal + deliveryFee;
  };

  useEffect(() => {
    onTotalAmountChange(calculateTotal());
  }, [cartItems]);

  return (
    <ul>
      <li className="subtitle">
        <p>
          Product <span className="float-end">Subtotal</span>
        </p>
      </li>
      {cartItems.map((item) => (
        <li key={item.id}>
          <p className="product_name_qnt">
            {item.name.split(' ').slice(0,3).join(' ')} x{item.quantity} <span className="float-end">${(item.price * item.quantity).toFixed(2)}</span>
          </p>
        </li>
      ))}
      <li className="subtitle">
        <p>
          Subtotal <span className="float-end totals">${calculateSubtotal().toFixed(2)}</span>
        </p>
      </li>
      <li className="subtitle">
        <p>
          Delivery Fee <span className="float-end totals">$10</span>
        </p>
      </li>
      <li className="subtitle">
        <p>
          Total <span className="float-end totals">${calculateTotal().toFixed(2)}</span>
        </p>
      </li>
    </ul>
  );
};

export default OrderAmountDetails;
