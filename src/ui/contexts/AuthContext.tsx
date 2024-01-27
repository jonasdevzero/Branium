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
import { Sidebar } from "../components";
import { Loading } from "../components/Loading";
import { Socket, websocketUrl } from "../services";

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

    socket.on("invite:new", (data) => console.log("new invite:", data));

    if (status === "authenticated" && !socket.isConnected) {
      socket.connect().catch(() => null);
    }

    return () => {
      socket.off("message");
      socket.off("incite:new");
      socket.disconnect();
    };
  }, [socket, status]);

  if (!user) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, socket, logout }}>
      <Sidebar onSearch={() => null} />
      {children}
    </AuthContext.Provider>
  );
}
