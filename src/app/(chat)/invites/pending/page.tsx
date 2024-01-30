"use client";

import { Invite } from "@/domain/models";
import {
  Card,
  InviteSkeleton,
  LoadingSpinner,
  Modal,
  Room,
} from "@/ui/components";
import { useAuth, useDebounce, useScrollEnd } from "@/ui/hooks";
import { toast } from "@/ui/modules";
import { messagesService } from "@/ui/services";
import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

const SkeletonLoading = new Array(20)
  .fill("")
  .map((_, i) => <InviteSkeleton key={i} buttons={2} />);

export default function InvitesPending() {
  const listRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [selectedInvite, setSelectedInvite] = useState<Invite>();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState(0);

  const { socket } = useAuth();

  const listInvites = useCallback(async (search?: string, page?: number) => {
    setIsLoading(true);

    try {
      const { content, pages } = await messagesService.invite.list({
        page: page ?? 0,
        limit: 30,
        search,
      });

      setPages(pages);
      setInvites((i) => [...i, ...content]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.on("invite:new", (invite) => setInvites((i) => [invite, ...i]));

    return () => {
      socket.off("invite:new");
    };
  }, [socket]);

  useDebounce(
    () => {
      setInvites([]);
      setCurrentPage(0);
      listInvites(search, currentPage);
    },
    [search],
    500
  );

  useScrollEnd(
    listRef,
    useCallback(() => {
      if (isLoading) return;
      if (currentPage === pages) return;

      setIsLoading(true);
      setCurrentPage(currentPage + 1);
      listInvites(search, currentPage + 1);
    }, [currentPage, isLoading, listInvites, pages, search])
  );

  const responseInvite = useCallback(
    async (inviteId: string, accept: boolean) => {
      setSelectedInvite(undefined);

      try {
        await messagesService.invite.response({ inviteId, accept });

        const message = `Convite ${accept ? "aceito" : "rejeitado"}!`;

        toast.success(message);
        setInvites((i) => i.filter((invite) => invite.id !== inviteId));
      } finally {
        // ...
      }
    },
    []
  );

  const renderInvites = useCallback(() => {
    const isFirstLoading = isLoading && currentPage === 0;

    if (isFirstLoading) return SkeletonLoading;

    if (invites.length === 0 && search.length === 0)
      return <p className="text">Nenhum convite pendente</p>;

    if (invites.length === 0)
      return <p className="text">Nenhum convite encontrado</p>;

    return invites.map((invite) => (
      <Card key={invite.id}>
        <Room
          name={invite.sender.name}
          username={invite.sender.username}
          image={invite.sender.image}
          type="secondary"
        />

        <button
          type="button"
          className="invite__action"
          onClick={() => setSelectedInvite(invite)}
        >
          responder
        </button>
      </Card>
    ));
  }, [isLoading, currentPage, invites, search.length]);

  return (
    <div className="invites__container">
      <div className="invites__title">
        <h3 className="text">CONVITES PENDENTES</h3>

        <p className="text">
          Aceite convites para criar vínculos com outros usuários para
          conversarem.
        </p>
      </div>

      <label
        className="card__container card__container--small"
        htmlFor="search_invite"
      >
        <input
          id="search_invite"
          type="text"
          className="description"
          placeholder="username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <MaterialSymbol className="icon" icon="search" size={16} />
      </label>

      <hr />

      <div
        ref={listRef}
        className={`invites__list ${
          isLoading && currentPage === 0 && "invites__list--loading"
        }`}
      >
        {renderInvites()}

        {isLoading && currentPage > 0 && <LoadingSpinner />}
      </div>

      <Modal
        title={`Convite de @${selectedInvite?.sender.username}`}
        isOpen={typeof selectedInvite !== "undefined"}
        close={() => setSelectedInvite(undefined)}
      >
        {!!selectedInvite?.message && (
          <div className="invite__message">
            <p className="text">mensagem:</p>
            <p className="text">{selectedInvite.message}</p>
          </div>
        )}

        <div className="modal__actions">
          <button
            type="button"
            onClick={() => responseInvite(selectedInvite!.id, false)}
          >
            rejeitar
          </button>

          <button
            type="button"
            onClick={() => responseInvite(selectedInvite!.id, true)}
          >
            aceitar
          </button>
        </div>
      </Modal>
    </div>
  );
}
