'use client'
import React, { useState, useEffect } from "react";
import useWishlistStore from "@/utils/store/useWishlistStore";
import useUserStore from "@/utils/store/userStore";

const Card = () => {
  const [totalOrders, setTotalOrders] = useState("0");
  const { wishlist } = useWishlistStore();
  const { user } = useUserStore();
  const [cards, setCards] = useState([
    {
      icon: "flaticon-list",
      timer: "0",
      para: "My Orders",
      className: "ff_one",
    },
    {
      icon: "flaticon-heart",
      timer: "0",
      para: "Favorites",
      className: "ff_one style3",
    },
  ]);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/orders/user/${user._id}/total`);
        const data = await response.json();
        setTotalOrders(data.totalOrders.toString());
        setCards(prev => prev.map((card, index) => 
          index === 0 ? { ...card, timer: data.totalOrders.toString() } : card
        ));
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    fetchTotalOrders();
  }, [user]);

  useEffect(() => {
    setCards(prev => prev.map((card, index) => 
      index === 1 ? { ...card, timer: wishlist.length.toString() } : card
    ));
  }, [wishlist]);

  return (
    <>
      {cards.map((card, index) => (
        <div className="col-sm-6 col-lg-4" key={index}>
          <div className={card.className}>
            <div className="icon">
              <span className={card.icon} />
            </div>
            <div className="detais text-end">
              <div className="timer">{card.timer}</div>
              <p className="para">{card.para}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
