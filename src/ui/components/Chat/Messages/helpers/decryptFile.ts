import { MessageFile } from "@/domain/models";
import { messagesService } from "@/ui/services";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";

interface DecryptFileDTO {
  file: MessageFile;
  privateKey: string;
}

export async function decryptFile(data: DecryptFileDTO) {
  const { file, privateKey } = data;

  let fileBytes: File | undefined;

  if (file.url instanceof File) fileBytes = file.url;

  if (typeof file.url === "string") {
    const { url } = await messagesService.file.loadUrl(file.url);

    const res = await fetch(decodeURIComponent(url));
    const blob = await res.blob();

    fileBytes = new File([blob], file.url);
  }

  if (!fileBytes) return;

  try {
    const decryptedKey = await AsymmetricCryptographer.decrypt(
      file.key,
      privateKey
    );

    const decryptedFile = await SymmetricCryptographer.decryptFile(
      fileBytes,
      decryptedKey
    );

    return decryptedFile;
  } catch (error) {}
}
