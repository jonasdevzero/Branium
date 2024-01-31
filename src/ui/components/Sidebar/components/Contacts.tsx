import { Contact } from "@/domain/models";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, ContactSkeleton, LoadingSpinner, Room } from "../..";
import { useRouter } from "next/navigation";
import { messagesService } from "@/ui/services";
import { useAuth, useDebounce, useScrollEnd } from "@/ui/hooks";

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

  useEffect(() => {
    socket.on("contact:new", (contact: Contact) =>
      setContacts((c) => [contact, ...c])
    );

    return () => {
      socket.off("contact:new");
    };
  }, [socket]);

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
      setContacts((c) => [...c, ...content]);
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
            className="button__small"
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
