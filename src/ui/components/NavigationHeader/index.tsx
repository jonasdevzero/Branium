"use client";
import Link from "next/link";
import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  onClose(): void;
}

export function NavigationHeader({ title, links, onClose }: Props) {
  const pathname = usePathname();

  return (
    <header className="card__container navigation__header">
      <h2 className="text">{title}</h2>

      <div className="divisor"></div>

      <nav>
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text ${pathname === link.href && "active"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="divisor"></div>

      <button type="button" className="icon__button" onClick={onClose}>
        <MaterialSymbol icon="close" size={24} color="#fff" />
      </button>
    </header>
  );
}
