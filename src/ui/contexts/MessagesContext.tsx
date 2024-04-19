"use client";
import { NewMessageDTO, SelectedMessageDTO } from "@/domain/dtos";
import EventEmitter from "events";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { FilesViewer } from "../components";
import { useAuth } from "../hooks";
import { MessagesEventEmitter } from "../types";
import { usePathname } from "next/navigation";

interface MessagesContextProps {
  event: MessagesEventEmitter;
  selectRoom(id: string | undefined): void;
  selectFiles(files: File[], initialIndex: number): void;
  selectedMessage: SelectedMessageDTO | null;
  selectMessage(data: SelectedMessageDTO | null): void;
}

export const MessagesContext = createContext({} as MessagesContextProps);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const event = useMemo<MessagesEventEmitter>(() => new EventEmitter(), []);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentRoomId, selectRoom] = useState<string>();
  const [selectedMessage, selectMessage] = useState<SelectedMessageDTO | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileIndex, setFileIndex] = useState(0);

  const { socket } = useAuth();
  const pathname = usePathname();

  const selectFiles = (files: File[], initialIndex: number) => {
    setSelectedFiles(files);
    setFileIndex(initialIndex);
  };

  useEffect(() => {
    socket.on("message:new", (data: NewMessageDTO) => {
      event.emit("message:new", data);

      if (data.roomId !== currentRoomId)
        audioRef.current?.play().catch(() => null);
    });

    socket.on("message:edit", (data) => event.emit("message:edit", data));

    socket.on("message:delete", (messageId: string) =>
      event.emit("message:delete", messageId)
    );

    return () => {
      socket.off("message:new");
      socket.off("message:edit");
      socket.off("message:delete");
    };
  }, [currentRoomId, event, socket]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.3;
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (selectedMessage?.type === "NAVIGATE")
      timeout = setTimeout(() => selectMessage(null), 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [selectedMessage]);

  useEffect(() => {
    selectMessage(null);
  }, [pathname]);

  return (
    <MessagesContext.Provider
      value={{ event, selectRoom, selectFiles, selectedMessage, selectMessage }}
    >
      <audio
        ref={audioRef}
        src={"/audio/new-message.wav"}
        autoPlay={false}
        loop={false}
      />

      {children}

      {!!selectedFiles.length && (
        <FilesViewer
          close={() => setSelectedFiles([])}
          files={selectedFiles}
          initialIndex={fileIndex}
        />
      )}
    </MessagesContext.Provider>
  );
}
