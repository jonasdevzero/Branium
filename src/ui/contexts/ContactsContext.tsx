"use client";

import EventEmitter from "events";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ContactsEventEmitter } from "../types";
import { useAuth, useMessages } from "../hooks";
import { Contact } from "@/domain/models";
import {
  BlockContactDTO,
  EditedContactDTO,
  NewMessageDTO,
} from "@/domain/dtos";
import { toast } from "../modules";
import { messagesService } from "../services";
import { sortContacts } from "../helpers";

interface ContactsContextProps {
  event: ContactsEventEmitter;
  data: Contact[];
  isLoading: boolean;
  isFirstLoading: boolean;
  isFullLoaded: boolean;
  currentPage: number;

  list(search?: string): Promise<void>;
  nextPage(search?: string): Promise<void>;
  load(id: string): Promise<Contact>;
}

export const ContactsContext = createContext({} as ContactsContextProps);

interface Props {
  children: React.ReactNode;
}

export function ContactsProvider({ children }: Props) {
  const event = useMemo<ContactsEventEmitter>(() => new EventEmitter(), []);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [pages, setPages] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState<string>();

  const isFirstLoading = useMemo(
    () => currentPage === -1 && isLoading,
    [currentPage, isLoading]
  );
  const isFullLoaded = useMemo(
    () => currentPage + 1 === pages,
    [currentPage, pages]
  );

  const { socket } = useAuth();
  const messages = useMessages();

  const list = useCallback(
    async (search?: string) => {
      if (isLoading) return;
      setIsLoading(true);

      const initSearch = search && search !== lastSearch;

      const selectedPage = initSearch || currentPage === -1 ? 0 : currentPage;

      if (initSearch) setCurrentPage(-1);

      try {
        const { pages, content } = await messagesService.contact.list({
          limit: 30,
          page: selectedPage,
          search,
        });

        setLastSearch(search);

        initSearch
          ? setContacts(content)
          : sortContacts({ contacts: [...contacts, ...content], setContacts });

        setPages(pages);
        if (currentPage === -1 || initSearch) setCurrentPage(0);
      } catch (error) {
        toast.error("Não foi possível buscar os contatos!", {
          id: "list-contacts",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [contacts, currentPage, isLoading, lastSearch]
  );

  const nextPage = useCallback(
    async (search?: string) => {
      if (!isFullLoaded) return;

      setCurrentPage(currentPage + 1);
      await list(search);
    },
    [currentPage, isFullLoaded, list]
  );

  const load = useCallback(
    async (id: string) => {
      const contact = contacts.find((c) => c.id === id);
      if (contact) return contact;

      return messagesService.contact.load(id);
    },
    [contacts]
  );

  useEffect(() => {
    list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContactEdit = useCallback(
    (data: EditedContactDTO) => {
      const { userId, ...rest } = data;

      setContacts(
        contacts.map((contact) => {
          if (contact.id === userId) Object.assign(contact, rest);
          return contact;
        })
      );
    },
    [contacts]
  );

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

  const onContactBlock = useCallback(
    (data: BlockContactDTO) => {
      const { contactId, blocked } = data;

      setContacts(
        contacts.map((contact) => {
          if (contact.id === contactId) Object.assign(contact, { blocked });

          return contact;
        })
      );

      event.emit("contact:block", data);
    },
    [contacts, event]
  );

  useEffect(() => {
    socket.on("contact:edit", (data) => event.emit("contact:edit", data));
    socket.on("contact:block", onContactBlock);
    socket.on("contact:new", (contact: Contact) =>
      setContacts((c) => [contact, ...c])
    );

    event.on("contact:edit", onContactEdit);

    return () => {
      socket.off("contact:edit");
      socket.off("contact:block");
      socket.off("contact:new");

      event.off("contact:edit", onContactEdit);
    };
  }, [event, onContactBlock, onContactEdit, socket]);

  useEffect(() => {
    messages.event.on("message:new", onNewMessage);

    return () => {
      messages.event.off("message:new", onNewMessage);
    };
  }, [messages.event, onNewMessage, socket]);

  return (
    <ContactsContext.Provider
      value={{
        event,
        data: contacts,
        isLoading,
        isFirstLoading,
        isFullLoaded,
        currentPage,
        list,
        nextPage,
        load,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
