import { MessageFileType, MessageType } from "@/domain/models";
import { audioMimeTypes, imageMimeTypes, videoMimeTypes } from ".";

export function getMessageType(files: File[], text?: string) {
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

export function getFileType(mimeType: string) {
  let type: MessageFileType = "FILE";

  if (imageMimeTypes.includes(mimeType)) type = "IMAGE";

  if (audioMimeTypes.includes(mimeType)) type = "AUDIO";

  if (videoMimeTypes.includes(mimeType)) type = "VIDEO";

  return type;
}
