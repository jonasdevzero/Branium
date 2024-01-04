"use client";
import { AuthStatus, User } from "@/domain/models";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

interface AuthContextProps {
  status: AuthStatus;
  user?: User;
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
    setAuthStatus("unauthenticated");
    router.replace("/login");
  }, [router]);

  const auth = useCallback(async () => {
    if (authStatus !== "loading") return;

    const access = getCookie("access", { path: "/" });

    if (!access) return logout();

    setAuthStatus("authenticated");
  }, [authStatus, logout]);

  useEffect(() => {
    auth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, status: authStatus }}>
      {children}
    </AuthContext.Provider>
  );
}
