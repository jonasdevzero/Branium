import "@/ui/css/components/skeleton.css";

interface MessageSkeletonProps {
  type: "text" | "image" | "file";
}

export function MessageSkeleton({ type }: MessageSkeletonProps) {
  return (
    <div className="skeleton__wrap message">
      <span className="skeleton__box avatar"></span>

      <div className="skeleton__wrap ">
        <div className="skeleton__wrap message__info">
          <span className="skeleton__box text username"></span>
          <span className="skeleton__box text timestamp"></span>
        </div>

        <span
          className={`skeleton__box message__content message__content--${type}`}
        />
      </div>
    </div>
  );
}
