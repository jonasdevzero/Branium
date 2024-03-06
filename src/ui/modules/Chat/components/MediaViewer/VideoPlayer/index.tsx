import { useMemo } from "react";
import "./styles.css";

interface Props {
  src: string | File;
}

export function VideoPlayer({ src }: Props) {
  const isFile = src instanceof File;

  const url = useMemo(
    () => (isFile ? URL.createObjectURL(src) : src),
    [isFile, src]
  );

  return (
    <video
      src={url}
      controls
      onLoad={() => (isFile ? URL.revokeObjectURL(url) : null)}
      className="video__player"
    />
  );
}
