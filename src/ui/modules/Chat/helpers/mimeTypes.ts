export const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

export const audioMimeTypes = [
  "audio/aac",
  "audio/mpeg",
  "audio/ogg",
  "audio/opus",
  "audio/wav",
  "audio/webm",
];

export const videoMimeTypes = ["video/mp4"];

export const documentMimeTypes = [
  "application/json",
  "application/pdf",
  "text/plain",
  "text/csv",
];

export const isImage = (file: File) => imageMimeTypes.includes(file.type);

export const isAudio = (file: File) => audioMimeTypes.includes(file.type);

export const isVideo = (file: File) => videoMimeTypes.includes(file.type);

export const isDocument = (file: File) => documentMimeTypes.includes(file.type);
