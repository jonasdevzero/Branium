"use client";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks";
import { Invite } from "@/domain/models";
import EventEmitter from "events";
import { messagesService } from "../services";
import { InvitesEventEmitter } from "../types";

interface InvitesContextProps {
  count: number;
  event: InvitesEventEmitter;
}

export const InvitesContext = createContext({} as InvitesContextProps);

interface Props {
  children: React.ReactNode;
}

export function InvitesProvider({ children }: Props) {
  const event = useMemo<InvitesEventEmitter>(() => new EventEmitter(), []);
  const [count, setCount] = useState(0);

  const { socket } = useAuth();

  useEffect(() => {
    messagesService.invite.count().then(setCount);
  }, []);

  useEffect(() => {
    socket.on("invite:new", (invite: Invite) => {
      setCount(count + 1);
      event.emit("invite:new", invite);
    });

    const onAnswered = () => setCount(count - 1);

    event.on("invite:answered", onAnswered);

    return () => {
      socket.off("invite:new");
      event.off("invite:answered", onAnswered);
    };
  }, [count, event, socket]);

  return (
    <InvitesContext.Provider value={{ count, event }}>
      {children}
    </InvitesContext.Provider>
  );
}
