import { AuthProvider } from "@/ui/contexts";
import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "react-material-symbols/outlined";
import { Sidebar } from "@/ui/components";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Branium | Channels",
  description: "The WebChat with 'E2E'",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={nunitoSans.className}>
        <main>
          <AuthProvider>
            <Sidebar />
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
