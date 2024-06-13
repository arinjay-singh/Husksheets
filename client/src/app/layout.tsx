/**
 * @file layout.tsx
 * @brief The root layout of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

// title and description metadata for the application
export const metadata: Metadata = {
    title: "HuskSheets",
    description: "Created by Arinjay, Kaan, Nick, Parnika, and Troy",
};

// root layout component
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    // render the layout
    return (
        <html lang="en">
        <body>
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}