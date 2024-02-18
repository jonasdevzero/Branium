"use client";
import EventEmitter from "events";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks";
import { MessagesEventEmitter } from "../types";
import { NewMessageDTO } from "@/domain/dtos";

interface MessagesContextProps {
  event: MessagesEventEmitter;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const MessagesContext = createContext({} as MessagesContextProps);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const event = useMemo<MessagesEventEmitter>(() => new EventEmitter(), []);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentRoomId, setCurrentRoomId] = useState<string>();

  const { socket } = useAuth();

  useEffect(() => {
    socket.on("message:new", (data: NewMessageDTO) => {
      event.emit("message:new", data);

      if (data.roomId !== currentRoomId)
        audioRef.current?.play().catch(() => null);
    });

    return () => {
      socket.off("message:new");
    };
  }, [currentRoomId, event, socket]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.3;
  }, []);

  return (
    <MessagesContext.Provider value={{ event, setCurrentRoomId }}>
      <audio
        ref={audioRef}
        src={"/audio/new-message.wav"}
        autoPlay={false}
        loop={false}
      />

      {children}
    </MessagesContext.Provider>
  );
}
