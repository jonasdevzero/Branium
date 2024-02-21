import { MessageFileType, MessageType } from "@/domain/models";

export interface CreateContactMessageDTO {
  sender: {
    key: string;
  };
  receiver: {
    id: string;
    key: string;
  };

  replyId?: string;
  message?: string;
  type: MessageType;

  files: Array<CreateFileDTO>;
}

export interface CreateFileDTO {
  file: File;
  type: MessageFileType;

  users: Array<{
    id: string;
    key: string;
  }>;
}
