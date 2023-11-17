import type { Metadata } from "next";
import "@fontsource/prompt";
import "./styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import NavbarTop from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarTop />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
