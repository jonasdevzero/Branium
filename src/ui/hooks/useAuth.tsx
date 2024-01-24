"use client";

import { AuthContext } from "@/ui/contexts";
import { useContext, useMemo } from "react";

export function useAuth() {
  const context = useContext(AuthContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
