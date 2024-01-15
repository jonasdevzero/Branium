"use client";
import { AuthStatus, User } from "@/domain/models";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import { Sidebar } from "../components";
import { Loading } from "../components/Loading";

interface AuthContextProps {
  status: AuthStatus;
  user: User;
}

export const AuthContext = createContext({} as AuthContextProps);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  const router = useRouter();

  const logout = useCallback(() => {
    deleteCookie("access", { path: "/" });
    deleteCookie("refresh", { path: "/" });

    setAuthStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  const auth = useCallback(async () => {
    if (authStatus !== "loading") return;

    const access = getCookie("access", { path: "/" });

    if (!access) return logout();

    const response = await fetch("/api/auth");

    if (!response.ok) return logout();

    const data = await response.json();

    setUser(data);
    setAuthStatus("authenticated");
  }, [authStatus, logout]);

  useEffect(() => {
    auth();
  }, [auth]);

  if (!user) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, status: authStatus }}>
      <Sidebar onSearch={() => null} />
      {children}
    </AuthContext.Provider>
  );
}
