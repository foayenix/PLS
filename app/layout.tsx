import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldwork — Felix’s AI Learning Studio",
  description: "Learn the foundations. Build with understanding. A personal AI engineering path for Felix Ayeni.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
