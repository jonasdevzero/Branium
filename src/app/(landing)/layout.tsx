import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "react-material-symbols/outlined";
import "@/ui/css/globals.css";
import { CookieConsent, Footer, Header } from "@/ui/components";
import { Toaster } from "@/ui/modules";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Branium",
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
        <Toaster />
        <Header />
        <CookieConsent />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
