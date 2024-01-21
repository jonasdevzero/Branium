"use client";
import useDebounce from "@/ui/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Card, Dropdown, DropdownItem, Room } from "..";
import "./styles.css";
import { useAuth } from "@/ui/services/hooks";

interface Props {
  onSearch(text: string): void;
}

export function Sidebar({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { logout } = useAuth();

  useDebounce(() => onSearch(search), [search], 500);

  const dropdownOptions = useMemo<DropdownItem[]>(
    () => [
      {
        label: "convidar usuário",
        icon: <MaterialSymbol icon="person_add" size={24} />,
        onClick: () => router.push("/invites"),
      },
      {
        label: "novo grupo",
        icon: <MaterialSymbol icon="group_add" size={24} />,
        onClick: () => null,
      },
      {
        label: "editar conta",
        icon: <MaterialSymbol icon="edit" size={24} />,
        onClick: () => null,
      },
      {
        label: "sair",
        icon: <MaterialSymbol icon="logout" size={24} />,
        onClick: logout,
      },
    ],
    [logout, router]
  );

  return (
    <aside className="sidebar">
      <Card>
        <Room name="Dev Zero" username="devzero" type="primary" />

        <Dropdown options={dropdownOptions} />
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
