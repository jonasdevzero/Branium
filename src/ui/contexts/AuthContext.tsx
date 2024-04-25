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
import { Socket, authServices, websocketUrl } from "../services";
import { KeyPairStorage } from "../utils";
import { EditProfileDTO } from "@/domain/dtos";

interface AuthContextProps {
  user: User;
  socket: Socket;
  logout(): void;
  update(): Promise<void>;
  edit(data: EditProfileDTO): void;
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

  const load = useCallback(async () => {
    const user = await authServices.auth();
    setUser(user);
  }, []);

  const auth = useCallback(async () => {
    if (status !== "loading") return;

    const access = getCookie("access", { path: "/" });

    if (!access) return logout();

    try {
      await load();
      setStatus("authenticated");
    } catch (error) {
      logout();
    }
  }, [status, logout, load]);

  const edit = useCallback(
    (data: EditProfileDTO) => {
      if (!user) return;

      const { image, ...rest } = data;
      let url = image === null ? null : user.image;

      if (image instanceof File) url = URL.createObjectURL(image);

      setUser({ ...user, ...rest, image: url });
    },
    [user]
  );

  useEffect(() => {
    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <AuthContext.Provider value={{ user, socket, logout, update: load, edit }}>
      {children}
    </AuthContext.Provider>
  );
}
