import { MessageFile } from "@/domain/models";
import "@/ui/css/components/skeleton.css";
import { useMemo } from "react";

interface Props {
  files: MessageFile[];
}

export function MessageFilesSkeleton({ files }: Props) {
  const { images, video, documents } = useMemo(
    () => ({
      images: files.filter((f) => f.type === "IMAGE").length,
      audio: files.some((f) => f.type === "AUDIO"),
      video: files.some((f) => f.type === "VIDEO"),
      documents: files.filter((f) => f.type === "FILE").length,
    }),
    [files]
  );

  return (
    <>
      <MessageImagesSkeleton count={images} />
      {video && <MessageVideoSkeleton />}
      <MessageDocumentSkeleton count={documents} />
    </>
  );
}

function MessageImagesSkeleton({ count }: { count: number }) {
  return (
    <div className="message__images">
      {new Array(count > 4 ? 4 : count).fill("").map((_, i) => (
        <span key={i} className="skeleton__box message__image"></span>
      ))}
    </div>
  );
}

function MessageVideoSkeleton() {
  return <span className="skeleton__box video__player"></span>;
}

function MessageDocumentSkeleton({ count }: { count: number }) {
  return new Array(count).fill("").map((_, i) => (
    <span key={i} className="skeleton__box message__document">
      <div className="skeleton__box text"></div>

      <div className="skeleton__warp message__info">
        <div className="skeleton__box description"></div>
        <div className="skeleton__box description"></div>
      </div>

      <span className="skeleton__box download"></span>
    </span>
  ));
}
