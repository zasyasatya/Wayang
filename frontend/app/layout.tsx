import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Wayang Bali — Platform Belajar Budaya",
    template: "%s · Wayang Bali",
  },
  description:
    "Platform pembelajaran budaya wayang Bali: jenis-jenis wayang, tokoh yang berperan, sejarah, serta belajar menggambar pola dan siluet.",
  keywords: [
    "wayang Bali",
    "wayang kulit",
    "budaya Bali",
    "menggambar wayang",
    "seni pewayangan",
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Wayang Bali — Platform Belajar Budaya",
    description:
      "Belajar jenis wayang, tokoh, sejarah, dan menggambar pola wayang Bali dari sumber terpercaya.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
