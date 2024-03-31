import { Message } from "@/domain/models";
import {
  Avatar,
  Button,
  Document,
  Dropdown,
  DropdownItem,
  MessageFilesSkeleton,
  MessageSkeleton,
  VideoPlayer,
} from "@/ui/components";
import { formatDate, formatTime } from "@/ui/helpers";
import { useAuth, useCryptoKeys } from "@/ui/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { ImageCards } from "..";
import {
  AudioPlayer,
  countEmojis,
  isAudio,
  isDocument,
  isImage,
  isOnlyEmoji,
  isVideo,
} from "@/ui/modules/Chat";
import { decryptFile, decryptText } from "../../helpers";
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
  const { user } = useAuth();

  const emojiSize = useMemo(() => {
    if (typeof decryptedText !== "string") return "";
    if (!isOnlyEmoji(decryptedText)) return "";

    const count = countEmojis(decryptedText);
    const size = count >= 4 ? 4 : count;

    return `text__emoji--${size}`;
  }, [decryptedText]);

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

  const renderedFiles = useMemo(() => {
    if (!message.files.length) return;

    if (message.files.length !== decryptedFiles.length)
      return <MessageFilesSkeleton files={message.files} />;

    const images = decryptedFiles.filter((f) => !!f && isImage(f)) as File[];

    const video = decryptedFiles.filter((f) => !!f && isVideo(f))[0];

    const documents = decryptedFiles.filter(
      (f) => !!f && isDocument(f)
    ) as File[];

    const audio = decryptedFiles.filter((f) => !!f && isAudio(f))[0];

    return (
      <>
        <ImageCards images={images} />

        {!!video && <VideoPlayer src={video} />}

        {documents.map((f) => (
          <Document key={f.name} file={f} download />
        ))}

        {!!audio && <AudioPlayer src={audio} />}
      </>
    );
  }, [decryptedFiles, message.files]);

  const messageActions = useMemo(() => {
    const options: DropdownItem[] = [
      {
        label: "deletar para mim",
        icon: <MaterialSymbol icon="delete" />,
        onClick: () => null,
      },
    ];

    if (message.sender.id === user.id)
      options.push({
        label: "deletar para todos",
        icon: <MaterialSymbol icon="delete" />,
        onClick: () => null,
      });

    return (
      <Dropdown
        position={{
          containerId: "messages__container",
          horizontalAxis: ["left", "right"],
          verticalAxis: ["bottom", "top"],
        }}
        icon={<MaterialSymbol icon="more_horiz" />}
        options={options}
      />
    );
  }, [message.sender.id, user.id]);

  if (short && !!decryptedText) {
    const isSending = message.isSending === true;

    return (
      <div
        id={message.id}
        className={`message ${!isSending && "message--short"}`}
      >
        {isSending && (
          <span title="enviando mensagem" className="message__pending">
            <MaterialSymbol icon="schedule_send" />
          </span>
        )}

        <span className="message__time description">
          {formatTime(message.createdAt)}
        </span>

        <div className="message__content">
          <p className={`text ${emojiSize}`}>{decryptedText}</p>
          {renderedFiles}
        </div>

        {messageActions}
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
          <span className="description">{formatDate(message.createdAt)}</span>
        </div>

        {!!decryptedText && (
          <p className={`text ${emojiSize}`}>{decryptedText}</p>
        )}

        {renderedFiles}
      </div>

      {messageActions}
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
