// features/auth/shared/hooks/useAuth.ts

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, AuthTokens } from "../types";
import { AUTH_SESSION_EVENT, clearAuthSession, readAuthSession, saveAuthSession } from "@/lib/auth-session";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => readAuthSession().user);
  const router = useRouter();

  const saveSession = (authUser: AuthUser, tokens: AuthTokens) => {
    saveAuthSession(authUser, tokens);
    setUser(authUser);
  };

  const clearSession = () => {
    clearAuthSession();
    setUser(null);
  };

  const logout = (redirectTo: string) => {
    clearSession();
    router.push(redirectTo);
  };

  useEffect(() => {
    const syncUser = () => setUser(readAuthSession().user);
    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_SESSION_EVENT, syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_SESSION_EVENT, syncUser);
    };
  }, []);

  return { user, saveSession, clearSession, logout };
}
