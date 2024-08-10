import { Message, RoomType } from "@/domain/models";

export interface NewMessageDTO {
  message: Message;
  roomId: string;
  type: RoomType;
}
