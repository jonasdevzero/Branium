"use client";

import { Contact, Message } from "@/domain/models";
import {
  Form,
  Header,
  Messages,
  SubmitMessageProps,
} from "@/ui/components/Chat";
import { getMessageType } from "@/ui/helpers";
import { useAuth, useCryptoKeys } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { MessageEvents } from "@/ui/types";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";
import EventEmitter from "events";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";

export default function ContactChannel() {
  const events = useMemo<MessageEvents>(() => new EventEmitter(), []);
  const [contact, setContact] = useState<Contact>();

  const { id: contactId } = useParams<{ id: string }>();
  const router = useRouter();

  const { user, socket } = useAuth();
  const cryptoKeys = useCryptoKeys();

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

  useEffect(() => {
    socket.on("contact:message:new", (data) => {
      if (data.contactId !== contactId) return;

      events.emit("message:new", data.message);
    });

    return () => {
      socket.off("contact:message:new");
    };
  }, [contactId, events, socket]);

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

  const submitMessage = useCallback(
    async (data: SubmitMessageProps) => {
      const { text, files } = data;

      if (!text && !files.length) return;

      const senderPublicKey = cryptoKeys.publicKey;
      const receiverPublicKey = await cryptoKeys.loadPublicKey(contactId);

      if (!receiverPublicKey || !senderPublicKey) {
        toast.error("Não foi possível enviar a mensagem");
        return;
      }

      const type = getMessageType(data);
      const key = SymmetricCryptographer.generateKeyBlob();
      const hasText = typeof text === "string" && text.trim().length > 0;

      const [senderKey, receiverKey, encryptedText] = await Promise.all([
        AsymmetricCryptographer.encrypt(key, senderPublicKey),
        AsymmetricCryptographer.encrypt(key, receiverPublicKey),
        hasText ? await SymmetricCryptographer.encrypt(text, key) : undefined,
      ]);

      const temporaryMessageId = window.crypto.randomUUID();

      const loadedMessage: Message = {
        id: temporaryMessageId,
        key: senderKey,
        message: encryptedText || null,
        type,
        files: [],
        reply: null,
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
        },
        createdAt: new Date().toString(),
        updatedAt: null,

        isSending: true,
      };

      events.emit("message:new", loadedMessage);

      try {
        await messagesService.message.contact.create({
          sender: { key: senderKey },
          receiver: { id: contactId, key: receiverKey },
          message: encryptedText,
          type,
          files: [],
        });

        events.emit("message:success", temporaryMessageId);
      } catch (error) {
        events.emit("message:fail", temporaryMessageId);

        toast.error("Não foi possível enviar a mensagem", {
          id: "send-message",
        });
      }
    },
    [contactId, cryptoKeys, user, events]
  );

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

      <Messages events={events} fetchMessages={fetchMessages} />

      <Form onSubmit={submitMessage} />
    </div>
  );
}
