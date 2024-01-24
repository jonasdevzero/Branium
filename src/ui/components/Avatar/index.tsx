"use client";
import Image from "next/image";
import "./styles.css";
import { minifyName } from "@/ui/helpers";
import { useState } from "react";
import { MediaViewer } from "..";

export type AvatarType = "primary" | "secondary";

interface Props {
  type?: AvatarType;
  url?: string | null;
  name: string;
  alt: string;
}

export const Avatar: React.FC<Props> = ({
  type = "primary",
  url,
  name,
  alt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const shortName = minifyName(name);

  return (
    <div className={`avatar__container avatar__${type}`}>
      {url ? (
        <Image
          src={url}
          alt={alt}
          width={50}
          height={50}
          unoptimized
          onClick={() => setIsOpen(!isOpen)}
        />
      ) : (
        <span className="avatar__name description" aria-label={shortName}>
          {shortName}
        </span>
      )}

      {isOpen && url ? (
        <MediaViewer
          close={() => setIsOpen(false)}
          files={[{ url, type: "image" }]}
        />
      ) : null}
    </div>
  );
};
