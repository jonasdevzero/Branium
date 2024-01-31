"use client";
import { useAuth, useInvites } from "@/ui/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Card, Room } from "..";
import { SidebarContacts, SidebarDropdown } from "./components";
import "./styles.css";

export function Sidebar() {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();
  const invitesContext = useInvites();

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

        <SidebarDropdown />
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

      <SidebarContacts search={search} />
    </aside>
  );
}
