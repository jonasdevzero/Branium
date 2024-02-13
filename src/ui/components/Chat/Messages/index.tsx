import { Message } from "@/domain/models";
import { useScrollEnd } from "@/ui/hooks";
import { Paginated } from "@/ui/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageComponent } from "./components";
import { isUngroupTime, sortMessages } from "./helpers";
import "./styles.css";

interface Props {
  fetchMessages(page: number): Promise<Paginated<Message>>;
}

export function Messages({ fetchMessages }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    if (containerRef.current === null) return;

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [containerRef]);

  const onFetchMessages = useCallback(async () => {
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
  }, [currentPage, fetchMessages, scrollDown]);

  useScrollEnd(
    containerRef,
    useCallback(() => {
      if (currentPage === pages) return;

      setCurrentPage((p) => p++);
      onFetchMessages();
    }, [currentPage, onFetchMessages, pages]),
    { position: "top" }
  );

  useEffect(() => {
    scrollDown();
    onFetchMessages();
  }, [onFetchMessages, scrollDown]);

  const renderMessages = useCallback(() => {
    if (isLoading && currentPage === 0)
      return <MessageComponent.Skeleton amount={50} />;

    return messages.map((message, index, array) => {
      const previousMessage = array[index + 1];

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
  }, [currentPage, isLoading, messages]);

  return (
    <div ref={containerRef} className="messages">
      {renderMessages()}
    </div>
  );
}
