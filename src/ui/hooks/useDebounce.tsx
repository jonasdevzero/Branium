import { useEffect, EffectCallback } from "react";

export function useDebounce(
  fn: Function,
  deps: any[] = [],
  time: number = 500
) {
  useEffect(() => {
    const timeout = setTimeout(() => fn(), time);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
