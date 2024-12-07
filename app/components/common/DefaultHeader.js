"use client";

import Link from "next/link";
import MainMenu from "./MainMenu";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useCartStore from "@/utils/store/useCartStore"; 
import { BsCart3 } from 'react-icons/bs';

const DefaultHeader = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const [isCartUpdated, setIsCartUpdated] = useState(false);

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Animation effect when cart is updated
  useEffect(() => {
    if (totalItems > 0) {
      setIsCartUpdated(true);
      const timer = setTimeout(() => setIsCartUpdated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <header className="header-nav menu_style_home_one home3_style main-menu">
      {/* Ace Responsive Menu */}
      <nav>
        <div className="container posr">
          {/* Menu Toggle btn*/}
          <div className="menu-toggle">
            <button type="button" id="menu-btn">
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>
          <Link href="/" className="navbar_brand float-start dn-md">
            <Image
              width={140}
              height={45}
              className="logo1 img-fluid"
              src="/images/header-logo2.svg"
              alt="header-logo.svg"
            />
            <Image
              width={140}
              height={45}
              className="logo2 img-fluid"
              src="/images/header-logo2.svg"
              alt="header-logo2.svg"
            />
          </Link>
          {/* Responsive Menu Structure*/}
          <ul
            className="ace-responsive-menu text-end"
            data-menu-style="horizontal"
          >
            <MainMenu />
            <li className="add_listing">
              <Link href="/add-listings">+ Build your Car</Link>
            </li>
            <li className="cart_btn flex items-center">
              <Link href="/cart" className="inline-flex items-center justify-center px-3">
                <div className="relative flex items-center">
                  <BsCart3 
                    size={22} 
                    className={`transition-transform duration-300 text-gray-700 ${isCartUpdated ? 'scale-125' : 'scale-100'}`}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            <li
              className="sidebar_panel"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <a className="sidebar_switch pt0" role="button">
                <span />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default DefaultHeader;
