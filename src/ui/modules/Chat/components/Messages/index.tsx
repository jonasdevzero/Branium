import {
  EditedContactDTO,
  EditedMessageDTO,
  NewMessageDTO,
  SuccessMessageDTO,
} from "@/domain/dtos";
import { Message, RoomType } from "@/domain/models";
import { LoadingSpinner } from "@/ui/components";
import {
  useContacts,
  useCryptoKeys,
  useMessages,
  useScrollEnd,
} from "@/ui/hooks";
import { Paginated } from "@/ui/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageComponent } from "./components";
import { isUngroupTime, sortMessages } from "./helpers";
import "./styles.css";
import { MESSAGES_CONTAINER_ID } from "../../constants";

interface Props {
  roomId: string;
  roomType: RoomType;
  fetchMessages(page: number): Promise<Paginated<Message>>;
  hasBlock?: boolean;
}

export function Messages({ roomId, roomType, fetchMessages, hasBlock }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastElement, setLastElement] = useState<Element>();

  const containerRef = useRef<HTMLDivElement>(null);
  const cryptoKeys = useCryptoKeys();
  const { event, selectedMessage, selectMessage } = useMessages();
  const contacts = useContacts();

  const scrollContainer = useCallback(() => {
    if (containerRef.current === null) return;

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [containerRef]);

  const onFetchMessages = useCallback(async () => {
    if (!cryptoKeys.privateKey) return;
    setIsLoading(true);

    try {
      const { pages, content } = await fetchMessages(currentPage);

      const lastElement = containerRef.current?.children[0];

      setPages(pages);
      setMessages((m) => sortMessages([...m, ...content]));

      currentPage === 0 ? scrollContainer() : setLastElement(lastElement);
    } catch (error) {
      // ...
    } finally {
      setIsLoading(false);
    }
  }, [cryptoKeys.privateKey, currentPage, fetchMessages, scrollContainer]);

  const onNewMessage = useCallback(
    (data: NewMessageDTO) => {
      const { message, ...info } = data;

      if (info.roomId !== roomId || info.type !== roomType) return;

      setMessages((m) => sortMessages([...m, message]));
      setTimeout(scrollContainer, 100);
    },
    [roomId, roomType, scrollContainer]
  );

  const onSuccessMessage = (data: SuccessMessageDTO) => {
    const { realMessageId, temporaryMessageId } = data;

    setMessages((messages) =>
      messages.map((m) => {
        if (m.id === temporaryMessageId)
          Object.assign(m, { id: realMessageId, isSending: undefined });

        return m;
      })
    );
  };

  const onEditedMessage = useCallback((data: EditedMessageDTO) => {
    const { messageId, text, updatedAt } = data;

    const update = { message: text, updatedAt };

    setMessages((messages) =>
      messages.map((m) => {
        if (m.id === messageId) Object.assign(m, update);
        if (m.reply?.id === messageId) Object.assign(m.reply, update);
        return m;
      })
    );
  }, []);

  const removeMessage = (messageId: string) =>
    setMessages((m) => m.filter(({ id }) => id !== messageId));

  const onContactEdit = useCallback((data: EditedContactDTO) => {
    const { userId, ...rest } = data;

    setMessages((m) =>
      m.map((message) => {
        if (message.sender.id === userId) Object.assign(message.sender, rest);

        return message;
      })
    );
  }, []);

  const navigateToMessage = useCallback(
    async (id: string) => {
      let messageElement = document.getElementById(`message:${id}`);

      if (!messageElement) {
        const loadedMessages: Message[] = [];

        let nextPage = currentPage + 1;
        let message: Message | undefined;

        while (!message) {
          const { content } = await fetchMessages(nextPage);

          nextPage++;
          loadedMessages.push(...content);
          message = loadedMessages.find((m) => m.id === id);
        }

        setCurrentPage(nextPage - 1);
        setMessages((m) => sortMessages([...m, ...loadedMessages]));

        selectMessage({ type: "NAVIGATE", data: message });
        return;
      }

      messageElement.scrollIntoView({
        inline: "center",
        block: "center",
        behavior: "smooth",
      });
    },
    [currentPage, fetchMessages, selectMessage]
  );

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
    onFetchMessages();
  }, [onFetchMessages]);

  useEffect(() => {
    if (!cryptoKeys.hasKeyPair()) cryptoKeys.requirePassword();
  }, [cryptoKeys]);

  useEffect(() => {
    event.on("message:new", onNewMessage);
    event.on("message:success", onSuccessMessage);
    event.on("message:fail", removeMessage);
    event.on("message:edit", onEditedMessage);
    event.on("message:delete", removeMessage);

    contacts.event.on("contact:edit", onContactEdit);

    return () => {
      event.off("message:new", onNewMessage);
      event.off("message:success", onSuccessMessage);
      event.off("message:fail", removeMessage);
      event.off("message:edit", onEditedMessage);
      event.off("message:delete", removeMessage);

      contacts.event.off("contact:edit", onContactEdit);
    };
  }, [contacts.event, event, onContactEdit, onEditedMessage, onNewMessage]);

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
          hasBlock={hasBlock}
        />
      );
    });
  }, [cryptoKeys.privateKey, hasBlock, isFirstLoading, messages]);

  useEffect(() => {
    if (lastElement && containerRef.current) {
      const elementRect = lastElement.getBoundingClientRect();

      const y = elementRect.top - elementRect.height;

      containerRef.current.scroll({
        left: 0,
        top: y,
        behavior: "instant",
      });

      setLastElement(undefined);
    }
  }, [lastElement, renderedMessages]);

  useEffect(() => {
    if (selectedMessage && selectedMessage.type === "NAVIGATE")
      navigateToMessage(selectedMessage.data.id);
  }, [navigateToMessage, selectedMessage]);

  return (
    <div
      id={MESSAGES_CONTAINER_ID}
      ref={containerRef}
      className={`messages ${isLoading ? "messages--lock" : ""}`}
    >
      {isLoading && currentPage > 0 && <LoadingSpinner />}
      {renderedMessages}
    </div>
  );
}
