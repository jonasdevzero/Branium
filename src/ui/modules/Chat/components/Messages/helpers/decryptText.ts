import { Message } from "@/domain/models";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";

interface DecryptTextDTO {
  message: Message;
  privateKey: string | null;
}

export async function decryptText(data: DecryptTextDTO) {
  const { message, privateKey } = data;
  const { message: text, key, reply } = message;

  if (!privateKey) {
    throw new Error("Decrypt key not found");
  }

  const [decryptedKey, decryptedReplyKey] = await Promise.all([
    text ? AsymmetricCryptographer.decrypt(key, privateKey) : null,
    reply ? AsymmetricCryptographer.decrypt(reply.key, privateKey) : null,
  ]);

  const [plainText, replyPlainText] = await Promise.all([
    decryptedKey && text
      ? SymmetricCryptographer.decrypt(text, decryptedKey)
      : undefined,
    decryptedReplyKey && reply?.message
      ? SymmetricCryptographer.decrypt(reply.message, decryptedReplyKey)
      : undefined,
  ]);

  return { text: plainText, replyText: replyPlainText, decryptedKey };
}
