"use client";

import { useState, type FormEvent } from "react";
import {
  Moon,
  Palette,
  Sun,
  Monitor,
  ShieldCheck,
  Check,
  LogOut,
  Loader2,
  Info,
} from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { THEMES, THEME_MODES, type ThemeId, type ThemeMode } from "@/lib/themes";

const MODE_ICONS: Record<ThemeMode, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
  auto: Monitor,
  light: Sun,
  dark: Moon,
};

export default function PengaturanPage() {
  const { theme, mode, setTheme, setMode, ready } = useTheme();
  const { user, hasToken, login, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setLoginError("Isi username dan password terlebih dahulu.");
      return;
    }
    setLoggingIn(true);
    setLoginError(null);
    try {
      await login(username.trim(), password);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="container-wrap py-6 md:py-8">
      <SectionHeading
        eyebrow="Preferensi"
        title="Pengaturan"
        subtitle="Sesuaikan warna tampilan dan mode terang/gelap. Semua pilihan tersimpan di perangkat Anda dan langsung diterapkan ke seluruh halaman."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* ===== Kolom kiri: tampilan ===== */}
        <div className="space-y-5">
          {/* Mode terang / gelap */}
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <Moon size={18} className="text-[var(--accent)]" aria-hidden />
                Mode terang / gelap
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Mode tampilan">
                {THEME_MODES.map((m) => {
                  const Icon = MODE_ICONS[m.id];
                  const active = ready ? mode === m.id : true;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={ready ? mode === m.id : undefined}
                      onClick={() => setMode(m.id)}
                      className={`flex items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                          active
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                        }`}
                      >
                        <Icon size={16} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm font-semibold ${active ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
                          {m.label}
                        </span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{m.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Tema warna */}
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <Palette size={18} className="text-[var(--accent)]" aria-hidden />
                Tema warna
              </h3>
              <span className="chip chip-muted hidden sm:inline-flex">tersimpan otomatis</span>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {THEMES.map((t) => {
                  const active = ready ? theme === t.id : true;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id as ThemeId)}
                      className={`flex items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <span
                        className="h-9 w-9 shrink-0 rounded-full shadow-inner ring-1 ring-black/10"
                        style={{ background: t.swatch }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-semibold ${active ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
                          {t.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-[var(--text-muted)]">
                          {t.description}
                        </span>
                      </span>
                      {active && (
                        <Check size={18} className="shrink-0 text-[var(--accent)]" aria-hidden />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pratinjau langsung */}
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">
                  Pratinjau
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="btn btn-primary btn-sm">Tombol utama</span>
                  <span className="btn btn-outline btn-sm">Tombol biasa</span>
                  <span className="chip chip-success">Selesai</span>
                  <span className="chip chip-pending">Menunggu</span>
                  <span className="chip chip-danger">Penting</span>
                  <span className="avatar avatar-sm">W</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== Kolom kanan: akun & tentang ===== */}
        <div className="space-y-5">
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <ShieldCheck size={18} className="text-[var(--accent)]" aria-hidden />
                Akun admin
              </h3>
              {user && <span className="chip chip-success">Masuk</span>}
            </div>
            <div className="p-4 sm:p-6">
              {user ? (
                <div>
                  <div className="flex items-center gap-3">
                    <span className="avatar" style={{ width: "2.75rem", height: "2.75rem", fontSize: "1rem" }}>
                      {user.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[var(--text)]">{user.name}</p>
                      <p className="truncate text-sm text-[var(--text-muted)]">@{user.username}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="chip">role: {user.role}</span>
                    <span className="chip chip-info">sesi 8 jam</span>
                  </div>
                  <button type="button" className="btn btn-outline mt-4 w-full" onClick={logout}>
                    <LogOut size={15} aria-hidden /> Keluar
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text)]" htmlFor="login-username">
                      Username
                    </label>
                    <input
                      id="login-username"
                      className="input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text)]" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      className="input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginError && (
                    <p className="rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]" role="alert">
                      {loginError}
                    </p>
                  )}
                  <button type="submit" className="btn btn-primary w-full" disabled={loggingIn || hasToken}>
                    {loggingIn ? (
                      <>
                        <Loader2 size={15} className="animate-spin" aria-hidden /> Memproses…
                      </>
                    ) : (
                      "Masuk sebagai admin"
                    )}
                  </button>
                  <p className="text-xs leading-relaxed text-[var(--text-soft)]">
                    Kredensial bawaan tercatat di <strong>README.md</strong> bagian
                    &ldquo;Akun admin&rdquo;. Ganti lewat <code>scripts/seed_admin.py</code>{" "}
                    di backend.
                  </p>
                </form>
              )}
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <Info size={18} className="text-[var(--accent)]" aria-hidden />
                Tentang
              </h3>
            </div>
            <div className="space-y-2 p-4 text-sm leading-relaxed text-[var(--text-muted)] sm:p-6">
              <p>
                <strong className="text-[var(--text)]">Wayang Bali</strong> — Platform Belajar
                Budaya &amp; Menggambar.
              </p>
              <p>
                Frontend Next.js 16 + React 19 · Backend FastAPI. Tema &amp; mode gelap
                tersimpan di <code>localStorage</code> perangkat Anda.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
