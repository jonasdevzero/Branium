"use client";

import { BlockContactDTO, SubmitMessageDTO } from "@/domain/dtos";
import { Contact } from "@/domain/models";
import { PopoverItem } from "@/ui/components";
import { useAuth, useContacts, useCryptoKeys, useMessages } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import {
  Alert,
  AsymmetricCryptographer,
  SymmetricCryptographer,
} from "@/ui/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Form, Header, Messages, ScrollDown } from "../components";
import { ContactProfile } from "../components/Sidebar";
import { MESSAGES_CONTAINER_ID } from "../constants";
import "../css/layout.css";
import { getFileType } from "../helpers";

interface Props {
  contactId: string;
}

export function ContactLayout({ contactId }: Props) {
  const [contact, setContact] = useState<Contact>();
  const [isProfileOpen, setIsOpenProfile] = useState(false);

  const router = useRouter();

  const { user } = useAuth();
  const cryptoKeys = useCryptoKeys();
  const messages = useMessages();
  const contacts = useContacts();

  const loadContact = useCallback(async () => {
    try {
      const [data] = await Promise.all([
        contacts.load(contactId),
        cryptoKeys.loadPublicKey(contactId),
      ]);

      setContact(data);
    } catch (error) {
      toast.error("Não foi possível buscar os dados desse contato!");
      router.push("/channels");
    }
  }, [contactId, contacts, cryptoKeys, router]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  useEffect(() => {
    messages.selectRoom(contactId);

    return () => {
      messages.selectRoom(undefined);
    };
  }, [contactId, messages]);

  const fetchMessages = useCallback(
    (page: number) =>
      messagesService.message.contact.list({
        contactId,
        page,
        limit: 50,
      }),
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
        hasText ? SymmetricCryptographer.encrypt(text, key) : undefined,
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
    async (data: SubmitMessageDTO) => {
      const { text, files, type, reply } = data;

      if (!text && !files.length) return;

      const [message, ...encryptedFiles] = await Promise.all([
        encryptText(text),
        ...files.map(encryptFile),
      ]);

      const temporaryMessageId = `temp:${crypto.randomUUID()}`;

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
          reply: reply || null,
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
        const messageId = await messagesService.message.contact.create({
          ...message,
          type,
          files: encryptedFiles,
          replyId: reply?.id,
        });

        messages.event.emit("message:success", {
          temporaryMessageId,
          realMessageId: messageId,
        });
      } catch (error) {
        messages.event.emit("message:fail", temporaryMessageId);

        toast.error("Não foi possível enviar a mensagem", {
          id: "send-message",
        });
      }
    },
    [contactId, encryptFile, encryptText, messages.event, user]
  );

  const toggleBlock = useCallback(() => {
    if (!contact) return;
    const { youBlocked, username } = contact;
    const action = youBlocked ? "desbloquear" : "bloquear";

    const title = `${youBlocked ? "Desbloquear" : "Bloquear"} contato`;
    const description = `Deseja realmente ${action} o @${username}?`;

    const onConfirm = async () => {
      try {
        await messagesService.contact.edit({
          contactId: contact.id,
          blocked: !youBlocked,
        });

        setContact({ ...contact, youBlocked: !contact.youBlocked });
        messages.selectMessage(null);
      } catch (error) {
        toast.error(`Não foi possível ${action} o @${username}!`);
      }
    };

    Alert.create({
      title,
      description,
      cancel: { label: "Cancelar" },
      confirm: {
        label: "Confirmar",
        theme: "danger",
        onClick: onConfirm,
      },
    });
  }, [contact, messages]);

  const headerOptions = useMemo<PopoverItem[]>(
    () => [
      {
        label: "perfil",
        icon: <MaterialSymbol icon={"person"} />,
        onClick: () => setIsOpenProfile(true),
      },
      {
        label: contact?.youBlocked ? "desbloquear" : "bloquear",
        icon: <MaterialSymbol icon="block" />,
        onClick: toggleBlock,
      },
      {
        label: "fechar",
        icon: <MaterialSymbol icon="close" />,
        onClick: () => router.push("/channels"),
      },
    ],
    [contact?.youBlocked, router, toggleBlock]
  );

  const onContactBlock = useCallback(
    (data: BlockContactDTO) => {
      if (!contact) return;

      const { contactId, blocked } = data;

      if (contactId !== contact.id) return;

      setContact({ ...contact, blocked });
      messages.selectMessage(null);
    },
    [contact, messages]
  );

  useEffect(() => {
    contacts.event.on("contact:block", onContactBlock);

    return () => {
      contacts.event.off("contact:block", onContactBlock);
    };
  }, [contacts.event, onContactBlock]);

  return (
    <div className="chat__container">
      <div className="chat__content">
        {!!contact ? (
          <Header
            name={contact.customName || contact.name}
            username={contact.username}
            image={contact.image}
            options={headerOptions}
            hasBlock={contact.blocked || contact.youBlocked}
          />
        ) : (
          <Header.Skeleton />
        )}

        <Messages
          roomId={contactId}
          roomType="CONTACT"
          fetchMessages={fetchMessages}
          hasBlock={contact?.blocked || contact?.youBlocked}
        />

        <ScrollDown containerId={MESSAGES_CONTAINER_ID} />

        <Form
          onSubmit={submitMessage}
          blocked={contact?.blocked}
          youBlocked={contact?.youBlocked}
          loading={!contact}
        />
      </div>

      {contact && (
        <ContactProfile
          contact={contact}
          isOpen={isProfileOpen}
          close={() => setIsOpenProfile(false)}
          setContact={setContact}
        />
      )}
    </div>
  );
}
