"use client";
import { useCall } from "@/ui/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Call() {
  const { state } = useCall();
  const router = useRouter();

  useEffect(() => {
    if (state !== "in-call") router.back();
  }, [router, state]);

  return;
}
