"use client";

import { CreateFileDTO } from "@/domain/dtos";
import { Contact } from "@/domain/models";
import {
  CreateMessageProps,
  Form,
  Header,
  Messages,
} from "@/ui/components/Chat";
import { useAuth, useCryptoKeys, useMessages } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { AsymmetricCryptographer, SymmetricCryptographer } from "@/ui/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { getFileType } from "@/ui/components/Chat/Form/helpers";

export default function ContactChannel() {
  const [contact, setContact] = useState<Contact>();

  const { id: contactId } = useParams<{ id: string }>();
  const router = useRouter();

  const { user } = useAuth();
  const cryptoKeys = useCryptoKeys();
  const messages = useMessages();

  const loadContact = useCallback(async () => {
    try {
      const [data] = await Promise.all([
        messagesService.contact.load(contactId),
        cryptoKeys.loadPublicKey(contactId),
      ]);

      setContact(data);
    } catch (error) {
      toast.error("Não foi possível buscar os dados desse contato!");
      router.push("/channels");
    }
  }, [contactId, cryptoKeys, router]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  useEffect(() => {
    messages.setCurrentRoomId(contactId);

    return () => {
      messages.setCurrentRoomId(undefined);
    };
  }, [contactId, messages]);

  const fetchMessages = useCallback(
    async (page: number) => {
      return await messagesService.message.contact.list({
        contactId,
        page,
        limit: 40,
      });
    },
    [contactId]
  );

  const encryptText = useCallback(
    async (text?: string) => {
      const key = SymmetricCryptographer.generateKeyBlob();
      const hasText = typeof text === "string" && text.trim().length > 0;

      const senderPublicKey = cryptoKeys.publicKey;
      const receiverPublicKey = await cryptoKeys.loadPublicKey(contactId);

      if (!receiverPublicKey || !senderPublicKey) {
        toast.error("Não foi possível enviar a mensagem");
        throw new Error("Error on encrypt file");
      }

      const [senderKey, receiverKey, encryptedText] = await Promise.all([
        AsymmetricCryptographer.encrypt(key, senderPublicKey),
        AsymmetricCryptographer.encrypt(key, receiverPublicKey),
        hasText ? await SymmetricCryptographer.encrypt(text, key) : undefined,
      ]);

      return {
        sender: { key: senderKey },
        receiver: { id: contactId, key: receiverKey },
        message: encryptedText,
      };
    },
    [contactId, cryptoKeys]
  );

  const encryptFile = useCallback(
    async (file: File) => {
      const fileKey = SymmetricCryptographer.generateKeyBlob();
      const senderPublicKey = cryptoKeys.publicKey;
      const receiverPublicKey = await cryptoKeys.loadPublicKey(contactId);

      if (!receiverPublicKey || !senderPublicKey) {
        toast.error("Não foi possível enviar a mensagem");
        throw new Error("Error on encrypt file");
      }

      const [encryptedFile, senderKey, receiverKey] = await Promise.all([
        SymmetricCryptographer.encryptFile(file, fileKey),
        AsymmetricCryptographer.encrypt(fileKey, senderPublicKey),
        AsymmetricCryptographer.encrypt(fileKey, receiverPublicKey),
      ]);

      return {
        file: encryptedFile,
        type: getFileType(file.type),
        users: [
          {
            id: user.id,
            key: senderKey,
          },
          {
            id: contactId,
            key: receiverKey,
          },
        ],
      };
    },
    [contactId, cryptoKeys, user.id]
  );

  const submitMessage = useCallback(
    async (data: CreateMessageProps) => {
      const { text, files, type } = data;

      if (!text && !files.length) return;

      const [message, ...encryptedFiles] = await Promise.all([
        encryptText(text),
        ...files.map(encryptFile),
      ]);

      const temporaryMessageId = crypto.randomUUID();

      messages.event.emit("message:new", {
        roomId: contactId,
        type: "CONTACT",
        message: {
          id: temporaryMessageId,
          key: message.sender.key,
          message: message.message,
          type,
          files: encryptedFiles.map((file) => ({
            id: crypto.randomUUID(),
            url: file.file,
            type: file.type,
            key: file.users.find((u) => u.id === user.id)!.key,
          })),
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
        },
      });

      try {
        await messagesService.message.contact.create({
          ...message,
          type,
          files: encryptedFiles,
        });

        messages.event.emit("message:success", temporaryMessageId);
      } catch (error) {
        messages.event.emit("message:fail", temporaryMessageId);

        toast.error("Não foi possível enviar a mensagem", {
          id: "send-message",
        });
      }
    },
    [contactId, encryptFile, encryptText, messages.event, user]
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
