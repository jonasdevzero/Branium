import { NewMessageDTO } from "@/domain/dtos";
import { Message, RoomType } from "@/domain/models";
import { useCryptoKeys, useMessages, useScrollEnd } from "@/ui/hooks";
import { Paginated } from "@/ui/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoadingSpinner } from "@/ui/components";
import { MessageComponent, ScrollDown } from "./components";
import { isUngroupTime, sortMessages } from "./helpers";
import "./styles.css";

interface Props {
  roomId: string;
  roomType: RoomType;
  fetchMessages(page: number): Promise<Paginated<Message>>;
}

export function Messages({ roomId, roomType, fetchMessages }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cryptoKeys = useCryptoKeys();
  const { event } = useMessages();

  const scrollDown = useCallback(() => {
    if (containerRef.current === null) return;

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [containerRef]);

  const onFetchMessages = useCallback(async () => {
    if (!cryptoKeys.privateKey) return;
    setIsLoading(true);

    try {
      const { pages, content } = await fetchMessages(currentPage);

      setPages(pages);
      setMessages((m) => sortMessages([...m, ...content]));

      if (currentPage === 0) scrollDown();
    } catch (error) {
      // ...
    } finally {
      setIsLoading(false);
    }
  }, [cryptoKeys.privateKey, currentPage, fetchMessages, scrollDown]);

  const onNewMessage = useCallback(
    (data: NewMessageDTO) => {
      const { message, ...info } = data;

      if (info.roomId !== roomId || info.type !== roomType) return;

      setMessages((m) => sortMessages([...m, message]));
      setTimeout(scrollDown, 100);
    },
    [roomId, roomType, scrollDown]
  );

  const onSuccessMessage = (messageId: string) =>
    setMessages((messages) =>
      messages.map((m) => {
        if (m.id === messageId) delete m.isSending;
        return m;
      })
    );

  const onFailMessage = (messageId: string) =>
    setMessages((m) => m.filter(({ id }) => id !== messageId));

  useScrollEnd(
    containerRef,
    useCallback(() => {
      if (currentPage + 1 === pages) return;

      setCurrentPage(currentPage + 1);
      onFetchMessages();
    }, [currentPage, onFetchMessages, pages]),
    { position: "top" }
  );

  useEffect(() => {
    scrollDown();
    onFetchMessages();
  }, [onFetchMessages, scrollDown]);

  useEffect(() => {
    if (!cryptoKeys.hasKeyPair()) cryptoKeys.requirePassword();
  }, [cryptoKeys]);

  useEffect(() => {
    event.on("message:new", onNewMessage);
    event.on("message:success", onSuccessMessage);
    event.on("message:fail", onFailMessage);

    return () => {
      event.off("message:new", onNewMessage);
      event.off("message:success", onSuccessMessage);
      event.off("message:fail", onFailMessage);
    };
  }, [event, onNewMessage]);

  const isFirstLoading = isLoading && currentPage === 0;

  const renderedMessages = useMemo(() => {
    if (!cryptoKeys.privateKey) return;

    if (isFirstLoading) return <MessageComponent.Skeleton amount={50} />;

    return messages.map((message, index, array) => {
      const previousMessage = array[index - 1];

      const isPreviousSameSender =
        message.sender.id === previousMessage?.sender.id;

      const ungroup =
        !!previousMessage && isUngroupTime(message, previousMessage);

      return (
        <MessageComponent
          key={message.id}
          message={message}
          short={isPreviousSameSender && !ungroup}
        />
      );
    });
  }, [cryptoKeys.privateKey, isFirstLoading, messages]);

  return (
    <div
      ref={containerRef}
      className={`messages ${isLoading ? "messages--lock" : ""}`}
    >
      {isLoading && currentPage > 0 && <LoadingSpinner />}
      {renderedMessages}

      <ScrollDown containerRef={containerRef} />
    </div>
  );
}
