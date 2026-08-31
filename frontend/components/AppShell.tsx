"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  Users,
  Clock,
  PenTool,
  Settings,
  FileText,
  Receipt,
  Search,
  Palette,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const SIDEBAR = [
  { href: "/", label: "Beranda", icon: LayoutGrid },
  { href: "/jenis-wayang", label: "Jenis Wayang", icon: BookOpen },
  { href: "/tokoh", label: "Tokoh", icon: Users },
  { href: "/sejarah", label: "Sejarah", icon: Clock },
  { href: "/belajar-menggambar", label: "Belajar Menggambar", icon: PenTool },
];

const SIDEBAR_ALT = [
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/docs", label: "Dokumentasi", icon: FileText },
  { href: "/sejarah", label: "Sejarah & Sumber", icon: Receipt },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-white">
        <PenTool size={18} aria-hidden />
      </span>
      <div className="min-w-0 leading-tight">
        <span className={`block truncate font-bold tracking-tight ${compact ? "text-base" : "text-lg"}`}>
          Wayang Bali
        </span>
        {!compact && (
          <span className="block truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">
            Platform Belajar Budaya
          </span>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const { effectiveMode, setMode } = useTheme();
  const { user } = useAuth();

  // Tutup drawer saat pindah halaman (mobile).
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initial = (user?.name ?? "Tamu").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="hidden lg:block border-r border-[var(--border)] bg-[var(--surface)]">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <div className="px-2 py-3">
            <Brand />
          </div>

          <nav className="mt-4 space-y-1" aria-label="Navigasi utama">
            {SIDEBAR.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}
              >
                <n.icon size={18} className="shrink-0" aria-hidden />
                <span>{n.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="px-3 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)]">
              Lainnya
            </p>
            <nav className="mt-2 space-y-1" aria-label="Navigasi tambahan">
              {SIDEBAR_ALT.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}
                >
                  <n.icon size={18} className="shrink-0" aria-hidden />
                  <span>{n.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-4">
            <div className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">
              <p className="font-semibold text-[var(--text)]">Warisan UNESCO</p>
              Wayang kulit diakui dunia sejak 2003. Materi disusun dari sumber
              terpercaya &amp; terakreditasi.
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Drawer (mobile) ===== */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawer(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 flex h-full w-[17rem] max-w-[85vw] flex-col overflow-y-auto bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between gap-2 px-1 py-2">
              <Brand compact />
              <button
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--text-muted)]"
                onClick={() => setDrawer(false)}
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-4 space-y-1" aria-label="Navigasi utama (mobile)">
              {[...SIDEBAR, ...SIDEBAR_ALT].map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className={`side-nav-item ${isActive(n.href) ? "active" : ""}`}
                >
                  <n.icon size={18} className="shrink-0" aria-hidden />
                  <span>{n.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">
              Wayang kulit — Warisan Budaya Takbenda UNESCO (2003/2008).
            </div>
          </aside>
        </div>
      )}

      {/* ===== Konten utama ===== */}
      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 md:px-8">
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>
            <span className="hidden font-bold tracking-tight lg:hidden xl:block">
              Wayang Bali
            </span>

            <div className="hidden flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-soft)] md:flex">
              <Search size={16} aria-hidden />
              <span className="min-w-0 flex-1 truncate">Cari materi, tokoh, atau siluet…</span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-0.5 text-[0.7rem]">
                ⌘F
              </kbd>
            </div>
            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/belajar-menggambar"
                className="btn btn-primary btn-sm hidden md:inline-flex"
              >
                Mulai Menggambar
                <ChevronDown size={14} aria-hidden />
              </Link>

              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                onClick={() => setMode(effectiveMode === "dark" ? "light" : "dark")}
                aria-label={effectiveMode === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
                title={effectiveMode === "dark" ? "Mode terang" : "Mode gelap"}
              >
                {effectiveMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <Link
                href="/pengaturan"
                className={`grid h-9 w-9 place-items-center rounded-full border bg-[var(--surface)] transition-colors ${
                  pathname.startsWith("/pengaturan")
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                }`}
                aria-label="Pengaturan tema & akun"
                title="Pengaturan"
              >
                <Palette size={16} />
              </Link>

              <Link
                href="/pengaturan"
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: user ? "var(--accent)" : "#6b6156" }}
                aria-label={user ? `Masuk sebagai ${user.name}` : "Masuk / akun"}
                title={user ? user.name : "Masuk sebagai tamu"}
              >
                {initial}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer ringkas */}
        <footer className="border-t border-[var(--border)] py-5">
          <div className="container-wrap flex flex-col items-start justify-between gap-2 text-xs text-[var(--text-soft)] sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Wayang Bali — Platform Belajar Budaya.</p>
            <p>Materi dari UNESCO, UNIMA, Kemenparekraf &amp; jurnal terakreditasi.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
