"use client";

import { ContactLayout } from "@/ui/modules/Chat/layouts";
import { useParams } from "next/navigation";
import "./styles.css";

export default function ContactChannel() {
  const { id: contactId } = useParams<{ id: string }>();

  return <ContactLayout contactId={contactId} />;
}
