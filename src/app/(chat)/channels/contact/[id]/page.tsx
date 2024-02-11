"use client";

import { Form, Header } from "@/ui/components/Chat";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { Contact } from "@/domain/models";
import { useParams } from "next/navigation";
import { messagesService } from "@/ui/services";

export default function ContactChannel() {
  const [contact, setContact] = useState<Contact>();

  const { id: contactId } = useParams<{ id: string }>();

  const loadContact = useCallback(async () => {
    try {
      const data = await messagesService.contact.load(contactId);

      setContact(data);
    } catch (error) {
      // ...
    }
  }, [contactId]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  return (
    <div className="container">
      {!!contact ? (
        <Header
          name={contact.name}
          username={contact.username}
          image={contact.image}
        />
      ) : (
        <Header.Skeleton />
      )}

      <div className="messages"></div>

      <Form />
    </div>
  );
}
