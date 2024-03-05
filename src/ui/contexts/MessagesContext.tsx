"use client";
import EventEmitter from "events";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks";
import { MessagesEventEmitter } from "../types";
import { NewMessageDTO } from "@/domain/dtos";
import { FilesViewer } from "../components";
import { MessageFile } from "@/domain/models";
import { messagesService } from "../services";

interface MessagesContextProps {
  event: MessagesEventEmitter;
  selectRoom(id: string | undefined): void;
  selectFiles(files: File[], initialIndex: number): void;
}

export const MessagesContext = createContext({} as MessagesContextProps);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const event = useMemo<MessagesEventEmitter>(() => new EventEmitter(), []);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentRoomId, selectRoom] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileIndex, setFileIndex] = useState(0);

  const { socket } = useAuth();

  const selectFiles = (files: File[], initialIndex: number) => {
    setSelectedFiles(files);
    setFileIndex(initialIndex);
  };

  const loadFile = async (file: MessageFile) => {
    let fileBytes: File | undefined;

    if (file.url instanceof File) fileBytes = file.url;

    if (typeof file.url === "string") {
      const { url } = await messagesService.file.loadUrl(file.url);

      const res = await fetch(decodeURIComponent(url));
      const blob = await res.blob();

      fileBytes = new File([blob], file.url);
    }

    return fileBytes;
  };

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
    <MessagesContext.Provider value={{ event, selectRoom, selectFiles }}>
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
