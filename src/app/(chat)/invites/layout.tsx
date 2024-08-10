"use client";

import { NavigationHeader } from "@/ui/components";
import { useRouter } from "next/navigation";
import "./styles.css";

interface Props {
  children: React.ReactNode;
}

export default function InvitesLayout({ children }: Props) {
  const router = useRouter();

  return (
    <div className="container">
      <NavigationHeader
        title="CONTATOS"
        links={[
          { label: "convidar", href: "/invites" },
          { label: "convites", href: "/invites/pending" },
        ]}
        onClose={() => router.push("/channels")}
      />

      {children}
    </div>
  );
}
