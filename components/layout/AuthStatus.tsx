"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthStatus({ isMobile = false }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (user) {
    return (
      <div className={isMobile ? "flex flex-col items-center gap-3" : "flex items-center gap-4"}>
        <p className="text-gray-700">{user.email}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <nav className={isMobile ? "flex flex-col items-center gap-4 w-full" : "flex items-center gap-4"}>
      <Link 
        href="/auth/login" 
        className="text-lg font-bold text-gray-600 hover:text-black"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="text-lg font-bold text-gray-600 hover:text-black"
      >
        Sign Up
      </Link>
    </nav>
  );
}