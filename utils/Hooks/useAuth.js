'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/utils/store/userStore';
import db from "@/utils/appwrite/Services/dbServices";
import axios from 'axios';

const useAuth = () => {
  const router = useRouter();
  const { user, session, setUser, setSession } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (typeof window === "undefined") return; // SSR safety

        const sessionId = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!sessionId || !userId) throw new Error("No session found");

        const userData = await axios.get(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/user/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        });
        setUser(userData.data);
        setSession({ id: sessionId, userId });
      } catch (error) {
        console.error('Session verification failed:', error);
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    if (!user && !session) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [user, session, router, setSession, setUser]);

  return { user, session, loading };
};

export default useAuth;
