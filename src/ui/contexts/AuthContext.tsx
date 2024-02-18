"use client";
import { AuthStatus, User } from "@/domain/models";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoadingContainer } from "../components";
import { Socket, websocketUrl } from "../services";
import { KeyPairStorage } from "../utils";

interface AuthContextProps {
  user: User;
  socket: Socket;
  logout(): void;
}

export const AuthContext = createContext({} as AuthContextProps);

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const socket = useMemo(() => new Socket(websocketUrl, "chat"), []);
  const [user, setUser] = useState<User>();
  const [status, setStatus] = useState<AuthStatus>("loading");

  const router = useRouter();

  const logout = useCallback(() => {
    setUser(undefined);
    deleteCookie("access", { path: "/" });
    deleteCookie("refresh", { path: "/" });
    KeyPairStorage.clear();

    setStatus("unauthenticated");
    socket.disconnect();
    router.replace("/login");
  }, [router, socket]);

  const auth = useCallback(async () => {
    if (status !== "loading") return;

    const access = getCookie("access", { path: "/" });

    if (!access) return logout();

    const response = await fetch("/api/auth");

    if (!response.ok) return logout();

    const data = await response.json();

    setUser(data);
    setStatus("authenticated");
  }, [status, logout]);

  useEffect(() => {
    auth();
  }, [auth]);

  useEffect(() => {
    socket.on("message", (data) => console.log("message:", data));

    if (status === "authenticated" && !socket.isConnected) {
      socket.connect().catch(() => null);
    }

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [socket, status]);

  if (!user) {
    return <LoadingContainer />;
  }

  return (
    <AuthContext.Provider value={{ user, socket, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
