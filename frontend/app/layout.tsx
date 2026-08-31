import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

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

/**
 * Script pre-paint: terapkan tema & mode tersimpan ke <html> SEBELUM render
 * pertama agar tidak ada kilatan tema default (FOUC).
 */
const themeBootstrap = `(function(){try{
var t=localStorage.getItem("wayang.theme");
var m=localStorage.getItem("wayang.themeMode");
var d=document.documentElement;
if(t)d.setAttribute("data-theme",t);
var eff=m==="dark"?"dark":m==="light"?"light":((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");
d.setAttribute("data-theme-mode",eff);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
