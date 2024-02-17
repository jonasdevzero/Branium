import { MessageType } from "@/domain/models";
import { SubmitMessageProps } from "../components/Chat";

const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
const audioMimeTypes = [
  "audio/aac",
  "audio/mpeg",
  "audio/ogg",
  "audio/opus",
  "audio/wav",
  "audio/webm",
];
const videoMimeTypes = ["video/mp4", "video/ogg", "video/webm"];

export function getMessageType(data: SubmitMessageProps) {
  const { text, files } = data;

  let type: MessageType = "TEXT";

  if (!files.length) return type;
  type = "MIX";

  if (typeof text === "string") return type;

  const filesType: string = new Set(files.map((file) => file.type))
    .values()
    .next().value;

  if (imageMimeTypes.includes(filesType)) type = "IMAGE";
  else if (audioMimeTypes.includes(filesType)) type = "AUDIO";
  else if (videoMimeTypes.includes(filesType)) type = "VIDEO";
  else type = "FILE";

  return type;
}
