import { useContext, useMemo } from "react";
import { CallContext } from "../modules/Call";

export function useCall() {
  const context = useContext(CallContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
