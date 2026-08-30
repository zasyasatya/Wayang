import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Font lokal (self-hosted) agar build & runtime tidak bergantung pada CDN online.
const jakarta = localFont({
  src: [
    { path: "../public/fonts/PlusJakartaSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/PlusJakartaSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const marcellus = localFont({
  src: [
    { path: "../public/fonts/Marcellus.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

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
    <html lang="id" className={`${jakarta.variable} ${marcellus.variable}`}>
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
