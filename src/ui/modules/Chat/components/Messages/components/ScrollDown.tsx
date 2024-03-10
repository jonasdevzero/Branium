import { useCallback, useLayoutEffect, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function ScrollDown({ containerRef }: Props) {
  const [show, setShow] = useState(false);

  const scrollDown = useCallback(() => {
    if (containerRef.current === null) return;

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [containerRef]);

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;

    const position = scrollHeight - scrollTop - clientHeight;

    setShow(position > 300);
  }, [containerRef]);

  useLayoutEffect(() => {
    containerRef.current?.addEventListener("scroll", onScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeEventListener("scroll", onScroll);
    };
  }, [containerRef, onScroll]);

  return (
    <button
      type="button"
      className={`button messages__scroll ${
        !show ? "messages__scroll--hidden" : ""
      }`}
      onClick={scrollDown}
    >
      <MaterialSymbol icon="arrow_drop_down" size={24} color="#fff" />
    </button>
  );
}
