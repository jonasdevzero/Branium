"use client";

import { useAuth } from "@/ui/services/hooks";

export default function Channels() {
  const { user } = useAuth();

  return (
    <>
      <h1>Channels page</h1>

      <p>Welcome {user.name}</p>
    </>
  );
}
