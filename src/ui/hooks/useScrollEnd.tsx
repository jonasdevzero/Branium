import { useCallback, useEffect } from "react";

export function useScrollEnd(ref: React.RefObject<any>, cb: () => void) {
  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const isAtBottom =
      ref.current.scrollTop + ref.current.clientHeight ===
      ref.current.scrollHeight;

    if (isAtBottom) cb();
  }, [cb, ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll, ref]);
}
