// features/auth/shared/hooks/useAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, AuthTokens } from "../types";

function loadUserFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("authUser");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem("authUser");
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);
  const router = useRouter();

  const saveSession = (authUser: AuthUser, tokens: AuthTokens) => {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    localStorage.setItem("userRole", authUser.role);
    document.cookie = `accessToken=${tokens.accessToken}; path=/; SameSite=Lax`;
    document.cookie = `userRole=${authUser.role}; path=/; SameSite=Lax`;
    setUser(authUser);
  };

  const clearSession = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";
    setUser(null);
  };

  const logout = (redirectTo: string) => {
    clearSession();
    router.push(redirectTo);
  };

  return { user, saveSession, clearSession, logout };
}
