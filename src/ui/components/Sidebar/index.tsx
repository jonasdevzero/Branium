"use client";
import useDebounce from "@/ui/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Card, Room } from "..";
import "./styles.css";

interface Props {
  onSearch(text: string): void;
}

export function Sidebar({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useDebounce(() => onSearch(search), [search], 500);

  return (
    <aside className="sidebar">
      <Card>
        <Room name="Dev Zero" username="devzero" type="primary" />
      </Card>

      <label
        className="card__container card__container--small"
        htmlFor="search"
      >
        <input
          id="search"
          type="text"
          className="description"
          placeholder="pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <MaterialSymbol className="icon" icon="search" size={16} />
      </label>

      <hr className="sidebar__divisor" />

      <div className="sidebar__group">
        <Card onClick={() => router.push("/channels/contact/1")}>
          <Room name="Developer One" username="devone" type="primary" />
        </Card>

        <Card onClick={() => router.push("/channels/contact/1")}>
          <Room name="Branium Squad" type="primary" />
        </Card>
      </div>
    </aside>
  );
}
