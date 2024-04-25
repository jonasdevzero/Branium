import { useContacts, useDebounce, useScrollEnd } from "@/ui/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { Button, Card, ContactSkeleton, LoadingSpinner, Room } from "../..";

interface Props {
  search: string;
}

export function SidebarContacts({ search }: Props) {
  const listRef = useRef(null);

  const router = useRouter();

  const contacts = useContacts();

  const renderContacts = useCallback(() => {
    if (contacts.isFirstLoading)
      return new Array(30).fill("").map((_, i) => <ContactSkeleton key={i} />);

    if (contacts.data.length === 0 && search.length === 0)
      return (
        <>
          <p className="text">Nenhum contato adicionado</p>
          <Button.Small onClick={() => router.push("/invites")}>
            adicionar
          </Button.Small>
        </>
      );

    if (contacts.data.length === 0) {
      return <p className="text">Nenhum contato encontrado</p>;
    }

    return contacts.data.map((contact) => (
      <Card
        key={contact.id}
        onClick={() => router.push(`/channels/contact/${contact.id}`)}
      >
        <Room
          name={contact.customName || contact.name}
          username={contact.username}
          image={contact.image}
          type="primary"
        />
      </Card>
    ));
  }, [contacts, router, search.length]);

  useDebounce(() => contacts.list(search), [search], 500);

  useScrollEnd(listRef, contacts.nextPage);

  return (
    <div ref={listRef} className="sidebar__group room__list">
      {renderContacts()}

      {!contacts.isFirstLoading && contacts.isLoading && <LoadingSpinner />}
    </div>
  );
}
