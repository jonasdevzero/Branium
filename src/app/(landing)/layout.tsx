import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "@/css/globals.css";
import { CookieConsent, Footer, Header } from "@/components";

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
        <Header />
        <CookieConsent />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}