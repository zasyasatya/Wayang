"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  FolderOpen,
  CheckSquare,
  MessagesSquare,
  FileText,
  Receipt,
  BookOpen,
  Users,
  Clock,
  PenTool,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const SIDEBAR = [
  { href: "/", label: "Beranda", icon: LayoutGrid },
  { href: "/jenis-wayang", label: "Jenis Wayang", icon: BookOpen },
  { href: "/tokoh", label: "Tokoh", icon: Users },
  { href: "/sejarah", label: "Sejarah", icon: Clock },
  { href: "/belajar-menggambar", label: "Belajar Menggambar", icon: PenTool },
];

const SIDEBAR_ALT = [
  { href: "/jenis-wayang", label: "Jenis Wayang", icon: FolderOpen },
  { href: "/tokoh", label: "Tokoh", icon: CheckSquare },
  { href: "/sejarah", label: "Sejarah", icon: MessagesSquare },
  { href: "/belajar-menggambar", label: "Menggambar", icon: PenTool },
];

const FOOTER_LINKS = [
  { href: "/docs", label: "Dokumentasi", icon: FileText },
  { href: "/sejarah", label: "Sejarah & Sumber", icon: Receipt },
];

function initialOf(label: string) {
  return label.trim().charAt(0).toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  // Tutup drawer saat pindah halaman (mobile).
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="hidden lg:block border-r border-[var(--border)] bg-[var(--surface)]">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <div className="flex items-center gap-2.5 px-2 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white">
              <PenTool size={18} aria-hidden />
            </span>
            <span className="text-lg font-bold tracking-tight">Mondays</span>
          </div>

          <nav className="mt-4 space-y-1">
            {SIDEBAR.map((n) => (
              <Link key={n.href} href={n.href} className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}>
                <n.icon size={18} aria-hidden />
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="px-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)]">
              Materi
            </p>
            <nav className="mt-2 space-y-1">
              {SIDEBAR_ALT.map((n) => (
                <Link key={n.href} href={n.href} className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}>
                  <n.icon size={18} aria-hidden />
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto space-y-1 pt-4">
            <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-muted)]">
              <span className="grid h-5 w-5 place-items-center rounded-md" style={{ background: "#a5b4fc" }} />
              <span className="truncate">Warisan UNESCO</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-muted)]">
              <span className="grid h-5 w-5 place-items-center rounded-md" style={{ background: "#86efac" }} />
              <span className="truncate">Belajar Menggambar</span>
            </div>
            {FOOTER_LINKS.map((n) => (
              <Link key={n.href} href={n.href} className="side-nav-item">
                <n.icon size={18} aria-hidden />
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* ===== Drawer (mobile) ===== */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute left-0 top-0 h-full w-[16rem] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between px-1 py-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white">
                  <PenTool size={18} aria-hidden />
                </span>
                <span className="text-lg font-bold tracking-tight">Mondays</span>
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-lg" onClick={() => setDrawer(false)} aria-label="Tutup menu">
                <X size={18} />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {[...SIDEBAR, ...FOOTER_LINKS].map((n) => (
                <Link key={n.href} href={n.href} className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}>
                  <n.icon size={18} aria-hidden />
                  {n.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ===== Konten utama ===== */}
      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <button
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-soft)] sm:flex">
              <Search size={16} aria-hidden />
              <span className="flex-1">Cari materi, tokoh, atau siluet…</span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[0.7rem]">
                ⌘F
              </kbd>
            </div>
            <div className="flex-1 sm:hidden" />

            <div className="flex items-center gap-2">
              <Link href="/belajar-menggambar" className="btn btn-primary btn-sm">
                Mulai Menggambar
                <ChevronDown size={14} aria-hidden />
              </Link>
              <button className="relative grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text-muted)]">
                <Bell size={16} aria-hidden />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: "#475569" }}>
                {initialOf("John")}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
