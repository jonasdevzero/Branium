"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Card, Dropdown, DropdownItem, Room } from "..";
import "./styles.css";
import { useAuth, useDebounce, useInvites } from "@/ui/hooks";
import { toast } from "@/ui/modules";

interface Props {
  onSearch(text: string): void;
}

export function Sidebar({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const invitesContext = useInvites();

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
        onClick: () =>
          toast.info("Em breve estará disponível!", { id: "soon-available" }),
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

  const renderExtraGroup = useCallback(() => {
    const canShow = pathname !== "/invites/pending" && invitesContext.count > 0;

    if (!canShow) return;

    return (
      <div className="sidebar__group">
        <Card.Small onClick={() => router.push("/invites/pending")}>
          <MaterialSymbol icon="mail" size={24} color="#fff" />
          {invitesContext.count} novo(s) convite(s)
        </Card.Small>
      </div>
    );
  }, [invitesContext.count, pathname, router]);

  return (
    <aside className="sidebar">
      <Card>
        <Room
          name={user.name}
          username={user.username}
          image={user.image}
          type="primary"
        />

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

      {renderExtraGroup()}

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
