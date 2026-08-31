"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, tokenStore, type AdminUser } from "@/lib/api";

interface AuthContextValue {
  /** Profil admin bila sesi valid, selain itu null. */
  user: AdminUser | null;
  /** Ada token tersimpan (termasuk yang belum tervalidasi). */
  hasToken: boolean;
  login: (username: string, password: string) => Promise<AdminUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [hasToken, setHasToken] = useState(false);

  // Pulihkan sesi dari token tersimpan saat aplikasi dibuka.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) return;
    setHasToken(true);
    api
      .me()
      .then(setUser)
      .catch(() => {
        tokenStore.set(null);
        setHasToken(false);
        setUser(null);
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    tokenStore.set(res.token);
    setHasToken(true);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.set(null);
    setHasToken(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, hasToken, login, logout }),
    [user, hasToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  return ctx;
}
