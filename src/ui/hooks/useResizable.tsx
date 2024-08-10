import { RefObject, useCallback, useEffect } from "react";

interface ElementSize {
  width: number;
  height: number;
}

export type ResizableCallback = (size: ElementSize) => void;

export function useResizable<E extends HTMLElement>(
  ref: RefObject<E>,
  cb: ResizableCallback,
  deps: unknown[] = []
) {
  const registerResizable = useCallback(() => {
    const parent = ref.current;

    if (!parent) return;

    const update = () => {
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;

      cb({ width, height });
    };

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === parent) update();
      }
    });

    observer.observe(parent);

    update();

    return observer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb, ref, ...deps]);

  useEffect(() => {
    const observer = registerResizable();

    return () => {
      if (observer) observer.disconnect();
    };
  }, [registerResizable]);
}
