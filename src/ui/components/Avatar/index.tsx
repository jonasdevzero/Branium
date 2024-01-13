import Image from "next/image";
import "./styles.css";
import { minifyName } from "@/ui/helpers";

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
  const shortName = minifyName(name);

  return (
    <div className={`avatar__container avatar__${type}`}>
      {url ? (
        <Image src={url} alt={alt} width={50} height={50} />
      ) : (
        <span className="avatar__name description" aria-label={shortName}>
          {shortName}
        </span>
      )}
    </div>
  );
};
