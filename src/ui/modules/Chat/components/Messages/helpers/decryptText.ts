import { Message } from "@/domain/models";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";

interface DecryptTextDTO {
  message: Message;
  privateKey: string | null;
}

export async function decryptText(data: DecryptTextDTO) {
  const { message, privateKey } = data;
  const { message: text, key } = message;

  if (!text) return;

  if (!privateKey) {
    throw new Error("Decrypt key not found");
  }

  const decryptedKey = await AsymmetricCryptographer.decrypt(key, privateKey);

  const plainText = await SymmetricCryptographer.decrypt(text, decryptedKey);

  return plainText;
}
