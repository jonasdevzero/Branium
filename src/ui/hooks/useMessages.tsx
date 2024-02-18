"use client";

import { MessagesContext } from "@/ui/contexts";
import { useContext, useMemo } from "react";

export function useMessages() {
  const context = useContext(MessagesContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
