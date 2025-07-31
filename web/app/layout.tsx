import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cliplet.app",
  description: "Area de transferência Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
