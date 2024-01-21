"use client";

import { Card, Room } from "@/ui/components";
import useDebounce from "@/ui/hooks/useDebounce";
import { useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

export default function Invites() {
  const [search, setSearch] = useState("");

  useDebounce(() => {}, [search], 500);

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
        <Card>
          <Room name="Dev Zero" username="devzero" type="secondary" />

          <button className="invite__action">convidar</button>
        </Card>
      </div>
    </div>
  );
}
