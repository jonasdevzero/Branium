export interface Message {
  id: string;
  key: string;

  message: string | null;
  type: MessageType;

  createdAt: string;
  updatedAt: string | null;

  sender: MessageSender;

  reply: null | {
    id: string;
    key: string;
    message: string | null;
    type: MessageType;
    sender: MessageSender;
  };

  files: Array<MessageFile>;
}

export type MessageType = "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO" | "MIX";

export interface MessageSender {
  id: string;
  name: string;
  username: string;
  image: string | null;
}

export interface MessageFile {
  id: string;
  url: string;
  type: MessageFileType;
  key: string;
}

export type MessageFileType = "IMAGE" | "FILE" | "AUDIO" | "VIDEO";
