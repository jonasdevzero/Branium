import { toast } from "@/ui/modules";
import { isImage } from ".";

// 5 MB
const sizeLimit = 5 * 1000 * 1000;

export function validateImages(images: File[]) {
  if (images.length > 5) {
    toast.error("Só é possível enviar 5 imagens por vez.", {
      id: "image-message",
    });
    return;
  }

  const hasInvalid = !!images.some((image) => !isValidImage(image));

  if (hasInvalid) return;

  return images;
}

export function isValidImage(image: File) {
  if (!isImage(image)) {
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
