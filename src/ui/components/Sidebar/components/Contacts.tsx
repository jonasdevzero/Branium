import { Contact } from "@/domain/models";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, ContactSkeleton, LoadingSpinner, Room } from "../..";
import { useRouter } from "next/navigation";
import { messagesService } from "@/ui/services";
import { useAuth, useDebounce, useMessages, useScrollEnd } from "@/ui/hooks";
import { NewMessageDTO } from "@/domain/dtos";
import { sortContacts } from "../helpers";

interface Props {
  search: string;
}

export function SidebarContacts({ search }: Props) {
  const listRef = useRef(null);
  const [contacts, setContacts] = useState([] as Contact[]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);

  const router = useRouter();
  const { socket } = useAuth();
  const messages = useMessages();

  const onNewMessage = useCallback(
    async (data: NewMessageDTO) => {
      const { roomId, type, message } = data;

      if (type !== "CONTACT") return;

      const lastUpdate = message.createdAt;

      const hasContact = contacts.some((contact) => contact.id === roomId);

      if (hasContact) {
        const updatedContacts = contacts.map((contact) => {
          if (contact.id === roomId) Object.assign(contact, { lastUpdate });
          return contact;
        });

        sortContacts({ contacts: updatedContacts, setContacts });
        return;
      }

      try {
        const contact = await messagesService.contact.load(roomId);

        sortContacts({ contacts: [...contacts, contact], setContacts });
      } catch (error) {}
    },
    [contacts]
  );

  useEffect(() => {
    socket.on("contact:new", (contact: Contact) =>
      setContacts((c) => [contact, ...c])
    );

    messages.event.on("message:new", onNewMessage);

    return () => {
      socket.off("contact:new");
      messages.event.off("message:new", onNewMessage);
    };
  }, [messages.event, onNewMessage, socket]);

  useEffect(() => {
    setIsLoading(true);
  }, [search]);

  const listContacts = useCallback(async (search?: string, page?: number) => {
    setIsLoading(true);

    try {
      const { pages, content } = await messagesService.contact.list({
        page: page ?? 0,
        limit: 30,
        search,
      });

      setPages(pages);
      sortContacts({ contacts: content, setContacts });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContacts = useCallback(() => {
    const isFirstLoading = isLoading && currentPage === 0;

    if (isFirstLoading)
      return new Array(30).fill("").map((_, i) => <ContactSkeleton key={i} />);

    if (contacts.length === 0 && search.length === 0)
      return (
        <>
          <p className="text">Nenhum contato adicionado</p>
          <button
            className="button button__small"
            type="button"
            onClick={() => router.push("/invites")}
          >
            adicionar
          </button>
        </>
      );

    if (contacts.length === 0) {
      return <p className="text">Nenhum contato encontrado</p>;
    }

    return contacts.map((contact) => (
      <Card
        key={contact.id}
        onClick={() => router.push(`/channels/contact/${contact.id}`)}
      >
        <Room
          name={contact.name}
          username={contact.username}
          image={contact.image}
          type="primary"
        />
      </Card>
    ));
  }, [contacts, currentPage, isLoading, router, search.length]);

  useDebounce(
    () => {
      setContacts([]);
      setCurrentPage(0);
      listContacts(search, currentPage);
    },
    [search],
    500
  );

  useScrollEnd(
    listRef,
    useCallback(() => {
      if (isLoading) return;
      if (currentPage === pages) return;

      setIsLoading(true);
      setCurrentPage(currentPage + 1);
      listContacts(search, currentPage + 1);
    }, [currentPage, isLoading, listContacts, pages, search])
  );

  return (
    <div ref={listRef} className="sidebar__group room__list">
      {renderContacts()}

      {isLoading && currentPage > 0 && <LoadingSpinner />}
    </div>
  );
}
