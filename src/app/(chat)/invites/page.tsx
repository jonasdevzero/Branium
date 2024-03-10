"use client";

import { User } from "@/domain/models";
import { Card, InviteSkeleton, Modal, Room } from "@/ui/components";
import { useDebounce } from "@/ui/hooks";
import { messagesService } from "@/ui/services";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

export default function Invites() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<User>();
  const [message, setMessage] = useState("");
  const [inviteSentTo, setInviteSentTo] = useState<User>();

  const listUsers = useCallback(async (search?: string) => {
    setIsLoading(true);

    try {
      const { content } = await messagesService.profile.list({ search });

      setUsers(content);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useDebounce(() => listUsers(search), [search], 500);

  const closeInviteModal = () => {
    setMessage("");
    setSelectedUser(undefined);
  };

  const inviteUser = useCallback(async () => {
    if (typeof selectedUser === "undefined") return;

    try {
      await messagesService.invite.create({
        receiverId: selectedUser.id,
        message,
      });

      listUsers(search);
      setInviteSentTo(selectedUser);
    } catch (error) {
      // ...
    } finally {
      setSelectedUser(undefined);
    }
  }, [listUsers, message, search, selectedUser]);

  const renderUsers = useCallback(() => {
    if (isLoading)
      return new Array(20).fill("").map((_, i) => <InviteSkeleton key={i} />);

    if (users.length === 0 && search.length === 0)
      return <p className="text">Nenhum usuário disponível para convite</p>;

    if (users.length === 0)
      return <p className="text">Nenhum usuário encontrado</p>;

    return users.map((user) => (
      <Card key={user.id}>
        <Room
          name={user.name}
          username={user.username}
          image={user.image}
          type="secondary"
        />

        <button
          type="button"
          className="invite__action"
          onClick={() => setSelectedUser(user)}
        >
          convidar
        </button>
      </Card>
    ));
  }, [isLoading, search.length, users]);

  return (
    <div className="invites__container">
      <div className="invites__title">
        <h3 className="text">CONVIDAR USUÁRIO</h3>

        <p className="text">
          Você pode convidar usuários pesquisando pelo username deles.
        </p>
      </div>

      <label
        className="card__container card__container--small"
        htmlFor="search_user"
      >
        <input
          id="search_user"
          type="text"
          className="description"
          placeholder="username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <MaterialSymbol className="icon" icon="search" size={16} />
      </label>

      <hr />

      <div className={`invites__list ${isLoading && "invites__list--loading"}`}>
        {renderUsers()}
      </div>

      <Modal
        title={`Convidar ${selectedUser?.username}`}
        close={closeInviteModal}
        isOpen={!!selectedUser}
      >
        <label htmlFor="invite_message" className="invite__message">
          mensagem (opcional):
          <textarea
            name="invite_message"
            id="invite_message"
            placeholder="Diga algo :)"
            value={message}
            onChange={(e) => {
              const value = e.target.value.slice(0, 120);
              setMessage(value);
            }}
          />
          <span className="description">{message.length}/120 caracteres</span>
        </label>

        <div className="modal__actions">
          <button className="button" type="button" onClick={closeInviteModal}>
            cancelar
          </button>

          <button className="button" type="button" onClick={inviteUser}>
            enviar
          </button>
        </div>
      </Modal>

      <Modal
        title="Convite enviado"
        isOpen={!!inviteSentTo}
        close={() => setInviteSentTo(undefined)}
      >
        <p className="text">
          Foi enviado um convite para @{inviteSentTo?.username}, caso ele aceite
          vocêm poderão se comunicar livremente.
        </p>
      </Modal>
    </div>
  );
}
