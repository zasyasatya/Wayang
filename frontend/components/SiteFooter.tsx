import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="container-wrap py-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-[#2a1a08]">
              <GraduationCap size={20} aria-hidden />
            </span>
            <span className="font-display text-lg">Wayang Bali</span>
          </div>
          <p className="max-w-sm text-sm text-[var(--text-muted)]">
            Platform belajar budaya wayang Bali untuk semua orang — mengenal jenis,
            tokoh, sejarah, dan berlatih menggambar pola. Berakar pada warisan budaya
            yang diakui UNESCO.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-soft)]">
            Materi
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li><Link className="hover:text-[var(--accent-hover)]" href="/jenis-wayang">Jenis-jenis wayang Bali</Link></li>
            <li><Link className="hover:text-[var(--accent-hover)]" href="/tokoh">Tokoh yang berperan</Link></li>
            <li><Link className="hover:text-[var(--accent-hover)]" href="/sejarah">Sejarah wayang Bali</Link></li>
            <li><Link className="hover:text-[var(--accent-hover)]" href="/belajar-menggambar">Belajar menggambar pola</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-soft)]">
            Warisan & Referensi
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li>
              <a className="hover:text-[var(--accent-hover)]" href="https://ich.unesco.org/en/RL/wayang-puppet-theatre-00063" target="_blank" rel="noreferrer">
                UNESCO — Wayang Puppet Theatre
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--accent-hover)]" href="https://wepa.unima.org/en/wayang/" target="_blank" rel="noreferrer">
                World Encyclopedia of Puppetry Arts
              </a>
            </li>
            <li>
              <a className="hover:text-[var(--accent-hover)]" href="https://id.wikipedia.org/wiki/Wayang_kulit_Bali" target="_blank" rel="noreferrer">
                Wayang Kulit Bali (Ensiklopedia)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-wrap border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-soft)]">
        © {new Date().getFullYear()} Wayang Bali Learning Platform — dibangun untuk pelestarian budaya. Untuk keperluan pembelajaran.
      </div>
    </footer>
  );
}
