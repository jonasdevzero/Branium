import { Message } from "@/domain/models";
import { Avatar, MessageFilesSkeleton, MessageSkeleton } from "@/ui/components";
import { formatDate, formatTime } from "@/ui/helpers";
import { useCryptoKeys } from "@/ui/hooks";
import { useCallback, useEffect, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { imageMimeTypes } from "../../../Form/helpers";
import { decryptFile, decryptText } from "../../helpers";
import { MessageImages } from "../MessageImages";
import "./styles.css";

interface MessageProps {
  message: Message;
  short?: boolean;
}

export function MessageComponent({ message, short }: MessageProps) {
  const { sender } = message;

  const [decryptedText, setDecryptedText] = useState<string>();
  const [decryptedFiles, setDecryptedFiles] = useState<Array<File | undefined>>(
    []
  );
  const cryptoKeys = useCryptoKeys();

  const decryptMessage = useCallback(async () => {
    const privateKey = cryptoKeys.privateKey;

    try {
      const plainText = await decryptText({ message, privateKey });

      setDecryptedText(plainText);
    } catch (error) {
      setDecryptedText("(Falha ao descriptografar a mensagem)");
    }
  }, [cryptoKeys.privateKey, message]);

  const decryptFiles = useCallback(async () => {
    if (!message.files.length) return;

    const privateKey = cryptoKeys.privateKey;

    if (!privateKey) return;

    const result = await Promise.all(
      message.files.map(async (file) => decryptFile({ file, privateKey }))
    );

    setDecryptedFiles(result as File[]);
  }, [cryptoKeys.privateKey, message.files]);

  useEffect(() => {
    decryptMessage();
    decryptFiles();
  }, [decryptFiles, decryptMessage]);

  const renderFiles = useCallback(() => {
    if (!message.files.length) return;

    if (message.files.length !== decryptedFiles.length)
      return <MessageFilesSkeleton files={message.files} />;

    const images = decryptedFiles.filter(
      (file) => !!file && imageMimeTypes.includes(file.type)
    ) as File[];

    return (
      <>
        <MessageImages images={images} />
      </>
    );
  }, [decryptedFiles, message.files]);

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

        <span className="message__time description">
          {formatTime(message.createdAt)}
        </span>

        <p className="text">{decryptedText}</p>
        {renderFiles()}
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

        {renderFiles()}
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
