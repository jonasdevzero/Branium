"use client";

import { Contact, Message } from "@/domain/models";
import {
  Form,
  Header,
  Messages,
  SubmitMessageProps,
} from "@/ui/components/Chat";
import { getMessageType } from "@/ui/helpers";
import { useAuth, useCryptoKeys, useMessages } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./styles.css";

export default function ContactChannel() {
  const [contact, setContact] = useState<Contact>();

  const { id: contactId } = useParams<{ id: string }>();
  const router = useRouter();

  const { user } = useAuth();
  const cryptoKeys = useCryptoKeys();
  const messages = useMessages();

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
        createdAt: new Date(),
        updatedAt: null,

        isSending: true,
      };

      messages.event.emit("message:new", {
        message: loadedMessage,
        roomId: contactId,
        type: "CONTACT",
      });

      try {
        await messagesService.message.contact.create({
          sender: { key: senderKey },
          receiver: { id: contactId, key: receiverKey },
          message: encryptedText,
          type,
          files: [],
        });

        messages.event.emit("message:success", temporaryMessageId);
      } catch (error) {
        messages.event.emit("message:fail", temporaryMessageId);

        toast.error("Não foi possível enviar a mensagem", {
          id: "send-message",
        });
      }
    },
    [cryptoKeys, contactId, user, messages.event]
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

      <Messages
        roomId={contactId}
        roomType="CONTACT"
        fetchMessages={fetchMessages}
      />

      <Form onSubmit={submitMessage} />
    </div>
  );
}
