import { isDocument } from ".";
import { toast } from "../..";

// 30 MB
const sizeLimit = 30 * 1000 * 1000;

export function validateDocuments(documents: File[]) {
  if (documents.length > 3) {
    toast.error("Só é possível enviar 3 documentos por vez.", {
      id: "document-message",
    });
    return;
  }

  const hasInvalid = !!documents.some((document) => !isValidDocument(document));

  if (hasInvalid) return;

  return documents;
}

export function isValidDocument(document: File) {
  if (!isDocument(document)) {
    toast.error(`Formato de documento inválido.`, {
      id: "document-message",
    });
    return false;
  }

  if (document.size > sizeLimit) {
    toast.error("Tamanho máximo permitido: 30MB.", { id: "document-message" });
    return false;
  }

  return true;
}
