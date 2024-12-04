'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/utils/store/useCartStore";

const CartItems = () => {
  const { cartItems, removeFromCart, addToCart } = useCartStore();

  if (cartItems.length === 0) {
    return <div className="p-5 h4">No items available</div>;
  }

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    useCartStore.setState((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  };

  return (
    <>
      {cartItems.map((item) => {
        const total = item.price * item.quantity;

        return (
          <tr key={item.id}>
            <th className="pl30" scope="row">
              <ul className="cart_list mt20">
                <li className="list-inline-item">
                  <Link href={`/shop-single/${item.id}`}>
                    <Image
                      width={70}
                      height={70}
                      quality={30}
                      src={item.imageSrc}
                      alt={`cart${item.id}.png`}
                    />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    className="cart_title"
                    href={`/shop-single/${item.id}`}
                  >

                    {item.name}
                  </Link>
                </li>
              </ul>
            </th>
            <td>${item.price}</td>
            <td>
              <input
                className="cart_count text-center"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              />
            </td>
            <td>${total}</td>
            <td className="pr25">
              <div
                className="pointer"
                title="Delete"
                onClick={() => removeFromCart(item.id)}
              >
                <span className="flaticon-trash" />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default CartItems;
