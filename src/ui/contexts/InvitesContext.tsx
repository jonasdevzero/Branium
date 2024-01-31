"use client";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks";
import { Invite } from "@/domain/models";
import EventEmitter from "events";
import { messagesService } from "../services";
import { InvitesContextEvent, InvitesContextProps } from "../types";

export const InvitesContext = createContext({} as InvitesContextProps);

interface Props {
  children: React.ReactNode;
}

export function InvitesProvider({ children }: Props) {
  const event = useMemo<InvitesContextEvent>(() => new EventEmitter(), []);
  const [count, setCount] = useState(0);

  const { socket } = useAuth();

  useEffect(() => {
    messagesService.invite.count().then(setCount);
  }, []);

  useEffect(() => {
    socket.on("invite:new", (invite: Invite) => {
      setCount((c) => c + 1);
      event.emit("invite:new", invite);
    });

    const onAnswered = () => setCount((c) => c - 1);

    event.on("invite:answered", onAnswered);

    return () => {
      socket.off("invite:new");
      event.off("invite:answered", onAnswered);
    };
  }, [event, socket]);

  return (
    <InvitesContext.Provider value={{ count, event }}>
      {children}
    </InvitesContext.Provider>
  );
}
