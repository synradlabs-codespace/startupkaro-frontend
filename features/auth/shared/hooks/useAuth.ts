// features/auth/shared/hooks/useAuth.ts

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser} from "../types";


export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const saveSession = (authUser: AuthUser, accessToken: string) => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userRole", authUser.role);
    document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax`;
    document.cookie = `userRole=${authUser.role}; path=/; SameSite=Lax`;
    setUser(authUser);
  };

  const clearSession = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";
    setUser(null);
  };

  const logout = (redirectTo: string) => {
    clearSession();
    router.push(redirectTo);
  };

  return { user, loading, saveSession, clearSession, logout };
}