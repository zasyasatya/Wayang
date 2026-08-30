"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, GraduationCap, BookOpen, Users, Clock, PenTool } from "lucide-react";

const NAV = [
  { href: "/", label: "Beranda", icon: GraduationCap },
  { href: "/jenis-wayang", label: "Jenis Wayang", icon: BookOpen },
  { href: "/tokoh", label: "Tokoh", icon: Users },
  { href: "/sejarah", label: "Sejarah", icon: Clock },
  { href: "/belajar-menggambar", label: "Belajar Menggambar", icon: PenTool },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="container-wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Beranda wayang Bali">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-[#2a1a08]">
            <GraduationCap size={20} aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-base tracking-wide">
              Wayang Bali
            </span>
            <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Platform Belajar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                }`}
              >
                <n.icon size={16} aria-hidden />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-[var(--text-muted)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="container-wrap border-t border-[var(--border)] pb-4 pt-2 md:hidden">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent-hover)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                <n.icon size={18} aria-hidden />
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
