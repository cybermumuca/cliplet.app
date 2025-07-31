"use client";

import { ThemeProvider } from "@/components/theme-provider";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="cliplet-theme"
    >
      {children}
    </ThemeProvider>
  );
}