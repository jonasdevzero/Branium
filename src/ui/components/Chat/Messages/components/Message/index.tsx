import { Message } from "@/domain/models";
import "./styles.css";
import { formatDate } from "@/ui/helpers";
import { Avatar, MessageSkeleton } from "@/ui/components";
import { useCallback, useEffect, useState } from "react";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";
import { useCryptoKeys } from "@/ui/hooks";
import { MaterialSymbol } from "react-material-symbols";

interface MessageProps {
  message: Message;
  short?: boolean;
}

export function MessageComponent({ message, short }: MessageProps) {
  const { sender } = message;

  const [decryptedText, setDecryptedText] = useState<string>();
  const cryptoKeys = useCryptoKeys();

  const decryptMessage = useCallback(async () => {
    const { key, message: text } = message;

    if (!text) return;

    const privateKey = cryptoKeys.privateKey;

    try {
      if (!privateKey) {
        throw new Error("Decrypt key not found");
      }

      const decryptedKey = await AsymmetricCryptographer.decrypt(
        key,
        privateKey
      );

      const plainText = await SymmetricCryptographer.decrypt(
        text,
        decryptedKey
      );

      setDecryptedText(plainText);
    } catch (error) {
      setDecryptedText("(Falha ao descriptografar a mensagem)");
    }
  }, [cryptoKeys.privateKey, message]);

  useEffect(() => {
    decryptMessage();
  }, [decryptMessage]);

  if (short && !!decryptedText) {
    const isSending = message.isSending === true;

    return (
      <div
        id={message.id}
        className={`message ${!isSending && "message--short"}`}
      >
        {isSending && (
          <span title="enviando mensagem" className="message__pending">
            <MaterialSymbol icon="schedule_send" size={24} color="#fff" />
          </span>
        )}

        <p className="text">{decryptedText}</p>
      </div>
    );
  }

  return (
    <div key={message.id} id={message.id} className="message message--full">
      <div className="avatar__wrap">
        <Avatar
          name={sender.name}
          alt={`foto de ${sender.name}`}
          url={sender.image}
        />

        {message.isSending === true && (
          <span title="enviando mensagem" className="message__pending">
            <MaterialSymbol icon="schedule_send" size={24} color="#fff" />
          </span>
        )}
      </div>

      <div className="message__content">
        <div className="message__info">
          <h6 className="text">{sender.name}</h6>
          <span className="text">{formatDate(message.createdAt)}</span>
        </div>

        {!!decryptedText && <p className="text">{decryptedText}</p>}
      </div>
    </div>
  );
}

interface MessageSkeletonProps {
  amount: number;
}

MessageComponent.Skeleton = function Skeleton({
  amount,
}: MessageSkeletonProps) {
  const values = ["text", "image", "file"] as const;

  function getRandomType() {
    const randomNumber = Math.random() * 100;

    if (randomNumber < 50) {
      return values[0];
    } else if (randomNumber < 75) {
      return values[1];
    } else {
      return values[2];
    }
  }

  return new Array(amount)
    .fill("")
    .map((_, i) => <MessageSkeleton key={i} type={getRandomType()} />);
};
