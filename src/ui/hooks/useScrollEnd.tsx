"use client";
import { useCallback, useEffect } from "react";

interface ScrollEndOptions {
  position?: "top" | "bottom";
}

export function useScrollEnd(
  ref: React.RefObject<any>,
  cb: () => void,
  options: ScrollEndOptions = {}
) {
  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const { position = "bottom" } = options;

    const isAtBottom =
      ref.current.scrollTop + ref.current.clientHeight ===
      ref.current.scrollHeight;

    const isAtTop = ref.current.scrollTop === 0;

    if (isAtBottom && position === "bottom") cb();
    if (isAtTop && position === "top") cb();
  }, [cb, options, ref]);

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
