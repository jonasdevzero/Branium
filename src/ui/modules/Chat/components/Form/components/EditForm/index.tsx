import { Message } from "@/domain/models";
import { useCallback, useEffect, useState } from "react";
import { EmojiPicker } from "../../..";
import { Avatar, Button } from "@/ui/components";
import { useCryptoKeys } from "@/ui/hooks";
import { decryptText } from "../../../Messages/helpers";
import { toast } from "@/ui/modules/Toaster";
import "./styles.css";
import { formatDate } from "@/ui/helpers";
import { messagesService } from "@/ui/services";
import { SymmetricCryptographer } from "@/ui/utils";

interface Props {
  message: Message;
  close(): void;
}

export function EditForm({ message, close }: Props) {
  const [text, setText] = useState("");
  const [decryptedKey, setDecryptedKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cryptoKeys = useCryptoKeys();

  const decryptMessage = useCallback(async () => {
    const privateKey = cryptoKeys.privateKey;

    try {
      const { text, decryptedKey } = await decryptText({ message, privateKey });

      setText(text || "");
      setDecryptedKey(decryptedKey || "");
    } catch (error) {
      toast.error("Não foi possível descriptografar a mensagem!", {
        id: "decrypt-message",
      });
      close();
    }
  }, [close, cryptoKeys.privateKey, message]);

  useEffect(() => {
    decryptMessage();
  }, [decryptMessage]);

  const submit = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (!text.trim().length) return;

    try {
      const encryptedText = await SymmetricCryptographer.encrypt(
        text,
        decryptedKey
      );

      await messagesService.message.edit({
        messageId: message.id,
        message: encryptedText,
      });

      close();
    } finally {
      setIsLoading(false);
    }
  }, [close, decryptedKey, isLoading, message.id, text]);

  return (
    <div className="overlay">
      <div className="edit__form">
        <div className="message message--full">
          <div className="avatar__wrap">
            <Avatar
              name={message.sender.name}
              alt={`foto de ${message.sender.name}`}
              url={message.sender.image}
            />
          </div>

          <div className="message__content">
            <div className="message__info">
              <h6 className="text">{message.sender.name}</h6>
              <span className="description">
                {formatDate(message.createdAt)}
              </span>
            </div>

            <p className="text">{text}</p>
          </div>
        </div>

        <div className="chat__form">
          <EmojiPicker onPick={(emoji) => setText((t) => t + emoji)} />

          <textarea
            name="text"
            id="message-text-file"
            className="text"
            placeholder="Digite uma mensagem (opcional)"
            autoFocus
            contentEditable="true"
            autoComplete="false"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter" && e.shiftKey) return true;

              if (e.code === "Enter" || e.code === "NumpadEnter") {
                e.preventDefault();
                submit();
                return false;
              }
            }}
          />

          <Button.Icon icon="close" title="cancelar" onClick={close} />
        </div>
      </div>
    </div>
  );
}
