import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovative Cursor EMS",
  description: "Innovative Cursor Employee Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
