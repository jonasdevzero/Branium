import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Footer, Header } from "@/components";
import "./globals.css";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Branium | Termos de Uso",
  description: "The WebChat with 'E2E'",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={nunitoSans.className}>
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
