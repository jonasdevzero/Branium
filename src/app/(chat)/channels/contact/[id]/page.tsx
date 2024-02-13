"use client";

import { Contact } from "@/domain/models";
import {
  Form,
  Header,
  Messages,
  SubmitMessageProps,
} from "@/ui/components/Chat";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./styles.css";

export default function ContactChannel() {
  const [contact, setContact] = useState<Contact>();

  const { id: contactId } = useParams<{ id: string }>();
  const router = useRouter();

  const loadContact = useCallback(async () => {
    try {
      const data = await messagesService.contact.load(contactId);
      setContact(data);
    } catch (error) {
      toast.error("Não foi possível buscar os dados desse contato!");
      router.push("/channels");
    }
  }, [contactId, router]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const fetchMessages = useCallback(
    async (page: number) => {
      return await messagesService.message.contact.list({
        contactId,
        page,
        limit: 50,
      });
    },
    [contactId]
  );

  const submitMessage = useCallback(async (data: SubmitMessageProps) => {
    // ...
  }, []);

  return (
    <div className="container">
      {!!contact ? (
        <Header
          name={contact.customName || contact.name}
          username={contact.username}
          image={contact.image}
        />
      ) : (
        <Header.Skeleton />
      )}

      <Messages fetchMessages={fetchMessages} />

      <Form onSubmit={submitMessage} />
    </div>
  );
}
