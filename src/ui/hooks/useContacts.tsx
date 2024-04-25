"use client";

import { useContext, useMemo } from "react";
import { ContactsContext } from "../contexts";

export function useContacts() {
  const context = useContext(ContactsContext);
  const memo = useMemo(() => context, [context]);

  return memo;
}
