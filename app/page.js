'use client'
import Home_7 from "./(home)/home/page";
import Wrapper from "./layout/wrapper";
import React, { useState, useEffect } from "react";
import './global.css'
import useAuth from '@/utils/Hooks/useAuth';
import PreLoader1 from './components/PreLoader1';

export default function MainRoot() {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force loading state for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || authLoading) {
    return <PreLoader1 />;
  }

  return (
    <Wrapper>
      <Home_7 />
    </Wrapper>
  );
}
