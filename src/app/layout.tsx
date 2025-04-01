import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import {Toaster} from 'react-hot-toast';

export const metadata: Metadata = {
  title: "LeapBuddy | New Leap Labs",
  description: "NLL Work Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body>
            {children}
          </body>
          <Toaster />
        </html>
      </Providers>
    </ClerkProvider>
  );
}
