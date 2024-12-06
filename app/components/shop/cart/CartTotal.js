"use client";
import React from "react";
import useCartStore from "@/utils/store/useCartStore";
import { useRouter } from "next/navigation";

const CartTotal = () => {
  const { cartItems } = useCartStore();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const total = subtotal;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="order_sidebar_widget style2">
      <h4 className="title">Cart Totals</h4>
      <ul className="mb15">
        <li className="subtitle">
          <p>
            Subtotal <span className="float-end">${subtotal.toFixed(2)}</span>
          </p>
        </li>
        <li className="subtitle">
          <p>
            Total <span className="float-end totals color-orose">${total.toFixed(2)}</span>
          </p>
        </li>
      </ul>
      <div className="ui_kit_button payment_widget_btn">
        <button type="button" className="btn btn-thm btn-block" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartTotal;
