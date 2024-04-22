import { Message } from "@/domain/models";
import {
  Avatar,
  Document,
  MessageFilesSkeleton,
  MessageSkeleton,
  Popover,
  PopoverItem,
  VideoPlayer,
} from "@/ui/components";
import { formatDate, formatTime } from "@/ui/helpers";
import { useAuth, useCryptoKeys, useMessages } from "@/ui/hooks";
import {
  AudioPlayer,
  MESSAGES_CONTAINER_ID,
  countEmojis,
  isAudio,
  isDocument,
  isImage,
  isOnlyEmoji,
  isVideo,
} from "@/ui/modules/Chat";
import { messageServices } from "@/ui/services/messages/message";
import { Alert } from "@/ui/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { ImageCards } from "..";
import { decryptFile, decryptText } from "../../helpers";
import "./styles.css";

interface MessageProps {
  message: Message;
  short?: boolean;
  hasBlock?: boolean;
}

export function MessageComponent({ message, short, hasBlock }: MessageProps) {
  const { sender, reply } = message;

  const [decryptedText, setDecryptedText] = useState<string>();
  const [decryptedReply, setDecryptedReply] = useState<string>();
  const [decryptedFiles, setDecryptedFiles] = useState<Array<File | undefined>>(
    []
  );
  const cryptoKeys = useCryptoKeys();
  const { user } = useAuth();
  const { selectedMessage, selectMessage } = useMessages();

  const isSelected = selectedMessage && message.id === selectedMessage.data.id;

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
      const { text, replyText } = await decryptText({ message, privateKey });

      setDecryptedText(text);
      setDecryptedReply(replyText);
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

  const replyMessage = useCallback(
    (message: Message) => {
      const messageElement = document.getElementById(`message:${message.id}`);

      if (!messageElement) return;

      selectMessage({ data: message, type: "REPLY" });
      setTimeout(
        () =>
          messageElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          }),
        100
      );
    },
    [selectMessage]
  );

  useEffect(() => {
    decryptMessage();
  }, [decryptMessage, message.message, message.reply?.message]);

  useEffect(() => {
    decryptFiles();
  }, [decryptFiles]);

  const renderedText = useMemo(() => {
    if (!decryptedText) return <span className="skeleton__box text"></span>;

    return <p className={`text ${emojiSize}`}>{decryptedText}</p>;
  }, [decryptedText, emojiSize]);

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
    const isSender = message.sender.id === user.id;

    const options: PopoverItem[] = [
      {
        label: `deletar para ${isSender ? "todos" : "mim"}`,
        icon: <MaterialSymbol icon="delete" />,
        onClick: () =>
          Alert.create({
            title: "Deletar mensagem?",
            description: "Deseja deletar permanentemente esta mensagem?",
            confirm: {
              label: "confirmar",
              onClick: () => messageServices.delete(message.id),
            },
            cancel: { label: "cancelar" },
          }),
      },
    ];

    if (!hasBlock) {
      options.splice(0, 0, {
        label: "responder",
        icon: <MaterialSymbol icon="reply" />,
        onClick: () => replyMessage(message),
      });
    }

    if (isSender && !hasBlock) {
      options.splice(1, 0, {
        label: "editar",
        icon: <MaterialSymbol icon="edit" />,
        onClick: () => selectMessage({ type: "EDIT", data: message }),
      });
    }

    return (
      <Popover
        position={{
          containerId: MESSAGES_CONTAINER_ID,
          horizontalAxis: ["left", "right"],
          verticalAxis: ["bottom", "top"],
        }}
        icon={<MaterialSymbol icon="more_horiz" />}
        options={options}
      />
    );
  }, [hasBlock, message, replyMessage, selectMessage, user.id]);

  const renderedReply = useMemo(() => {
    if (!reply) return null;

    if (!decryptedReply) {
      return <span className="skeleton__box reply"></span>;
    }

    return (
      <div
        className="message__reply description"
        onClick={() =>
          selectMessage({
            type: "NAVIGATE",
            data: reply as Message,
          })
        }
      >
        <span className="reply__username">@{reply.sender.username}</span>

        <span className="reply__text">{decryptedReply}</span>
      </div>
    );
  }, [decryptedReply, reply, selectMessage]);

  const isSending = message.isSending === true;

  if (short) {
    return (
      <div
        key={message.id}
        id={`message:${message.id}`}
        className={`message ${!isSending && "message--short"} ${
          isSelected && "message--selected"
        }`}
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
          {renderedReply}
          {renderedText}
          {renderedFiles}
        </div>

        {messageActions}

        {message.updatedAt && (
          <span className="message__edited description">(editado)</span>
        )}
      </div>
    );
  }

  return (
    <div
      key={message.id}
      id={`message:${message.id}`}
      className={`message message--full ${isSelected && "message--selected"}`}
    >
      <div className="avatar__wrap">
        <Avatar
          name={sender.name}
          alt={`foto de ${sender.name}`}
          url={sender.image}
        />

        {isSending && (
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

        {renderedReply}
        {renderedText}
        {renderedFiles}
      </div>

      {messageActions}

      {message.updatedAt && (
        <span className="message__edited description">(editado)</span>
      )}
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
