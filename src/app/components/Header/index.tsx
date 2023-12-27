"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import "./styles.css";

export const Header: React.FC = () => {
  const path = usePathname();

  if (path === "/") return null;

  return (
    <header>
      <Link href={"/"}>
        <h2 className="header2">Branium</h2>
      </Link>

      <nav>
        {path === "/register" && (
          <Link href={"/login"} className="header4">
            Entrar
          </Link>
        )}

        {path === "/login" && (
          <Link href={"/register"} className="header4">
            Cadastrar
          </Link>
        )}
      </nav>
    </header>
  );
};
