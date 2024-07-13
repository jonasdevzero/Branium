import { Sidebar } from "@/ui/components";
import {
  AuthProvider,
  ContactsProvider,
  CryptoKeysProvider,
  InvitesProvider,
  MessagesProvider,
} from "@/ui/contexts";
import { Toaster } from "@/ui/modules";
import { CallProvider } from "@/ui/modules/Call";
import { CallView } from "@/ui/modules/Call/components";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "react-material-symbols/outlined";
import "./globals.css";

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
        <Toaster />

        <main>
          <AuthProvider>
            <InvitesProvider>
              <CryptoKeysProvider>
                <MessagesProvider>
                  <ContactsProvider>
                    <CallProvider>
                      <>
                        <Sidebar />
                        {children}

                        <CallView />
                      </>
                    </CallProvider>
                  </ContactsProvider>
                </MessagesProvider>
              </CryptoKeysProvider>
            </InvitesProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
