"use client";

import { User } from "@/domain/models";
import { Card, Room } from "@/ui/components";
import { useDebounce } from "@/ui/hooks";
import { messagesService } from "@/ui/services";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

export default function Invites() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const listUsers = useCallback(async (search?: string) => {
    try {
      const { content } = await messagesService.profile.list({ search });

      setUsers(content);
    } catch (e) {
      // ...
    }
  }, []);

  useDebounce(
    () => {
      listUsers(search);
    },
    [search],
    500
  );

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
          placeholder="pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <MaterialSymbol className="icon" icon="search" size={16} />
      </label>

      <hr />

      <div className="invites__list">
        {users.map((user) => (
          <Card key={user.id}>
            <Room
              name={user.name}
              username={user.username}
              image={user.image}
              type="secondary"
            />

            <button type="button" className="invite__action">
              convidar
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
