import { Avatar, Button, Modal } from "@/ui/components";
import "@/ui/modules/Chat/css/sidebar.css";
import { Contact } from "@/domain/models";
import { formatDate } from "@/ui/helpers";
import { useCallback, useState } from "react";
import { messagesService } from "@/ui/services";
import { toast } from "@/ui/modules/Toaster";

interface Props {
  isOpen: boolean;
  close(): void;

  contact: Contact;
  setContact(contact: Contact): void;
}

export function ContactProfile({ contact, isOpen, close, setContact }: Props) {
  const [isEditContactNameOpen, setIsEditContactNameOpen] = useState(false);

  return (
    <aside
      className={`chat__sidebar${!isOpen ? " chat__sidebar--closed" : ""}`}
    >
      <div className="header">
        <h5 className="text">Perfil do contato</h5>

        <Button.Icon icon="close" onClick={close} />
      </div>

      <section className="main__data">
        <Avatar
          type="secondary"
          url={contact.image}
          name={contact.name}
          alt={`foto do @${contact.username}`}
        />

        <div className="title__container">
          <h2 className="text" title={contact.name}>
            {contact.name}
          </h2>

          <h3 className="description" title={`@${contact.username}`}>
            @{contact.username}
          </h3>
        </div>
      </section>

      <hr />

      <section>
        <div className="info">
          <div className="header">
            <h6 className="text">Apelido</h6>

            <Button.Icon
              icon="edit"
              onClick={() => setIsEditContactNameOpen(true)}
            />
          </div>

          <span className="description">
            {contact.customName ? "~" + contact.customName : "(não definido)"}
          </span>
        </div>

        <div className="info">
          <div className="header">
            <h6 className="text">Contato desde</h6>
          </div>

          <span className="description">{formatDate(contact.createdAt)}</span>
        </div>
      </section>

      <EditContactNameModal
        isOpen={isEditContactNameOpen}
        close={() => setIsEditContactNameOpen(false)}
        contact={contact}
        onEdit={(customName) => setContact({ ...contact, customName })}
      />
    </aside>
  );
}

interface EditContactNameProps {
  isOpen: boolean;
  close(): void;
  contact: Contact;
  onEdit(name: string): void;
}

function EditContactNameModal({
  isOpen,
  close,
  contact,
  onEdit,
}: EditContactNameProps) {
  const [customName, setCustomName] = useState(contact.customName || "");
  const [isLoading, setIsLoading] = useState(false);

  const edit = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await messagesService.contact.edit({
        contactId: contact.id,
        name: customName,
      });

      onEdit(customName);
      close();
    } catch (error) {
      toast.error("Não foi possível aditar o apelido!", {
        id: "edit-contact-custom-name",
      });
    } finally {
      setIsLoading(false);
    }
  }, [close, contact.id, customName, isLoading, onEdit]);

  return (
    <Modal isOpen={isOpen} close={close} title="Editar apelido">
      <label htmlFor="contact_name" className="form__label">
        apelido
        <input
          id="contact_name"
          type="text"
          autoFocus
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter" || e.code === "NumpadEnter") edit();

            if (e.code === "Escape") close();
          }}
        />
      </label>

      <div className="modal__actions">
        <Button onClick={close} disabled={isLoading}>
          cancelar
        </Button>

        <Button isLoading={isLoading} onClick={edit}>
          confirmar
        </Button>
      </div>
    </Modal>
  );
}
