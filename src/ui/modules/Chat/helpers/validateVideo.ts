import { toast } from "@/ui/modules";
import { isVideo } from ".";

// 20 MB
const sizeLimit = 20 * 1000 * 1000;

export function isValidVideo(video: File) {
  if (!isVideo(video)) {
    toast.error("Formato de vídeo inválido, permitido: .mp4", {
      id: "video-message",
    });

    return false;
  }

  if (video.size > sizeLimit) {
    toast.error("Tamanho máximo permitido: 20MB.", { id: "video-message" });
    return false;
  }

  return true;
}
