/**
 * @file layout.tsx
 * @brief The root layout of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HuskSheets",
  description: "Created by Arinjay, Kaan, Nick, Parnika, and Troy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
