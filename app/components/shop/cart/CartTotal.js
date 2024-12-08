'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/utils/store/useCartStore';
import Coupon from './Coupon';

const CartTotal = () => {
  const { cartItems } = useCartStore();
  const router = useRouter();
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="order_sidebar_widget style2">
      <h4 className="title">Cart Totals</h4>
      <ul className="mb15" style={{ 
        listStyle: 'none',
        padding: 0,
        margin: '0 0 20px 0'
      }}>
        <li className="subtitle" style={{ marginBottom: '15px' }}>
          <p style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            margin: 0,
            fontSize: '15px'
          }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
        </li>
        {appliedCoupon && (
          <li className="subtitle" style={{ marginBottom: '15px' }}>
            <p style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              margin: 0,
              fontSize: '15px',
              color: '#28a745'
            }}>
              <span>Discount ({appliedCoupon.discount}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </p>
          </li>
        )}
        <li className="subtitle">
          <p style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            margin: 0,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            <span>Total</span>
            <span className="totals color-orose">${total.toFixed(2)}</span>
          </p>
        </li>
      </ul>

      <Coupon onApplyCoupon={handleApplyCoupon} />

      <div className="ui_kit_button payment_widget_btn">
        <button 
          type="button" 
          className="btn btn-thm btn-block" 
          onClick={handleCheckout}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '500'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartTotal;
