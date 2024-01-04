import { AuthProvider } from "@/ui/contexts";
import "@/ui/css/globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "react-material-symbols/outlined";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Branium | Channels",
  description: "The WebChat with 'E2E'",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={nunitoSans.className}>
        <main>
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
