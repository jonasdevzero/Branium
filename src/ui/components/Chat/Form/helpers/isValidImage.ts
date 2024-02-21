import { toast } from "@/ui/modules";
import { imageMimeTypes } from ".";

// 5 MB
const sizeLimit = 5 * 1000 * 1000;

export function isValidImage(image: File) {
  if (!imageMimeTypes.includes(image.type)) {
    toast.error(`Formato de imagem inválida, permitidas: .png, .jpg e .jpeg.`, {
      id: "image-message",
    });
    return false;
  }

  if (image.size > sizeLimit) {
    toast.error("Tamanho máximo permitido: 5MB.", { id: "image-message" });
    return false;
  }

  return true;
}
