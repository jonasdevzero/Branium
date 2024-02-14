import { useContext, useMemo } from "react";
import { CryptoKeysContext } from "../contexts";

export function useCryptoKeys() {
  const context = useContext(CryptoKeysContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
