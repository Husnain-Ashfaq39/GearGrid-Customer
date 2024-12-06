'use client'
import React, { useState, useEffect } from "react";
const Card = () => {
  const [totalOrders, setTotalOrders] = useState("0");
  const [cards, setCards] = useState([
    {
      icon: "flaticon-list",
      timer: "0",
      para: "My Orders",
      className: "ff_one",
    },
    {
      icon: "flaticon-message",
      timer: "74",
      para: "Messages",
      className: "ff_one style2",
    },
    {
      icon: "flaticon-heart",
      timer: "20",
      para: "Favorites",
      className: "ff_one style3",
    },
  ]);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders/totalOrders");
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
  }, []);

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
