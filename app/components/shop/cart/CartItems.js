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

  const handleQuantityChange = (e, _id) => {
    const inputQuantity = parseInt(e.target.value, 10) || 1;

    const item = cartItems.find(item => item._id === _id);
    const stockQuantity = item ? item.stockQuantity : 0;

    // Ensure quantity does not exceed stock
    if (inputQuantity > stockQuantity) {
      alert(`Only ${stockQuantity} items are available in stock.`);
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: stockQuantity } : item
        ),
      }));
    } else if (inputQuantity < 1) {
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: 1 } : item
        ),
      }));
    } else {
      useCartStore.setState((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: inputQuantity } : item
        ),
      }));
    }
  };

  return (
    <>
      {cartItems.map((item) => {
        const total = (item.price || 0) * (item.quantity || 1);
        const imageSrc = item.images && item.images.length > 0 ? item.images[0] : "/images/placeholder.png";

        return (
          <tr key={item._id}>
            <th className="pl30" scope="row">
              <ul className="cart_list mt20">
                <li className="list-inline-item">
                  <Link href={`/shop-single/${item._id}`}>
                    <Image
                      width={70}
                      height={70}
                      quality={30}
                      src={imageSrc}
                      alt={`Image of ${item.name}`}
                    />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link className="cart_title" href={`/shop-single/${item._id}`}>
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
                onChange={(e) => handleQuantityChange(e, item._id)}
              />
            </td>
            <td>${total}</td>
            <td className="pr25">
              <div
                className="pointer"
                title="Delete"
                onClick={() => removeFromCart(item._id)}
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
