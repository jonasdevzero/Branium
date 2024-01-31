import { useContext, useMemo } from "react";
import { InvitesContext } from "../contexts";

export function useInvites() {
  const context = useContext(InvitesContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
