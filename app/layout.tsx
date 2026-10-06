import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scrapling Web Scraper",
  description: "Scrape websites using Scrapling",
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
