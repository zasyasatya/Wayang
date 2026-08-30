import Link from "next/link";
import {
  ListChecks,
  FolderCheck,
  BarChart3,
  Search,
  Calendar,
  StickyNote,
  MoreHorizontal,
  ChevronDown,
  Star,
  ArrowRight,
  Clock,
} from "lucide-react";

const PROJECTS = [
  {
    name: "Mengenal Jenis-jenis Wayang Bali",
    desc: "Parwa, Ramayana, Gambuh, Calonarang, Cupak, Sasak, Arja, Tantri, Kamasan.",
    assignee: "Materi 1",
    status: "In Progress",
    tone: "success",
    href: "/jenis-wayang",
  },
  {
    name: "Tokoh yang Berperan dalam Wayang",
    desc: "Rama, Arjuna, Bima, Hanoman, panasar Tualen, Merdah, Delem, Sangut.",
    assignee: "Materi 2",
    status: "Pending",
    tone: "pending",
    href: "/tokoh",
  },
  {
    name: "Sejarah & Filosofi Wayang Bali",
    desc: "Dari pengaruh Hindu-Majapahit hingga pengakuan UNESCO.",
    assignee: "Materi 3",
    status: "Completed",
    tone: "info",
    href: "/sejarah",
  },
  {
    name: "Latihan Menggambar Pola & Siluet",
    desc: "Pilih tokoh, gambar di kanvas, lalu nilai hasilnya otomatis.",
    assignee: "Materi 4",
    status: "In Progress",
    tone: "success",
    href: "/belajar-menggambar",
  },
];

const SCHEDULE = [
  { day: 15, dow: "Mo", active: false },
  { day: 16, dow: "Tu", active: false },
  { day: 17, dow: "We", active: true },
  { day: 18, dow: "Th", active: false },
  { day: 19, dow: "Fr", active: false },
  { day: 20, dow: "Sa", active: false },
  { day: 14, dow: "Su", active: false },
];

const EVENTS = [
  {
    title: "Mengenal Wanda & Proporsi",
    time: "01:00 PM to 02:30 PM",
    tone: "#16a34a",
    tag: "Pemula",
  },
  {
    title: "Menggambar Muka Wayang",
    time: "04:00 PM to 02:30 PM",
    tone: "#2563eb",
    tag: "Pemula",
  },
  {
    title: "Latihan Siluet + Penilaian",
    time: "05:00 PM to 02:30 PM",
    tone: "#9333ea",
    tag: "Menengah",
  },
];

const NOTES = [
  {
    title: "Jenis-jenis wayang BALI",
    desc: "Mulai dari wayang Parwa sebagai yang paling populer di Pulau Dewata.",
    done: false,
    href: "/jenis-wayang",
  },
  {
    title: "Memahami warna & wanda tokoh",
    desc: "Warna dan bentuk wajah menandakan watak — alus, gagah, denawa, panasar.",
    done: false,
    href: "/tokoh",
  },
  {
    title: "Berlatih menggambar dengan garis panduan",
    desc: "Nyalakan mode 'Tampilkan garis panduan' agar mudah menelusuri siluet.",
    done: true,
    href: "/belajar-menggambar",
  },
];

function statusChip(tone: string) {
  return `chip chip-${tone}`;
}

export default function HomePage() {
  return (
    <div className="container-wrap py-6 md:py-8">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-[var(--text-muted)]">Selamat datang di platform belajar</p>
        <h1 className="mt-1">
          Selamat Belajar! Salam, <span className="text-[var(--accent)]">John</span>,
        </h1>
      </div>

      {/* Stat chips */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Stat value="13" label="Jenis Wayang" tone="info" icon={Star} />
        <Stat value="18" label="Tokoh" tone="success" icon={FolderCheck} />
        <Stat value="6" label="Siluet Latihan" tone="danger" icon={ListChecks} />
        <Stat value="5" label="Bab Sejarah" tone="pending" icon={BarChart3} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* ===== Left column ===== */}
        <div className="space-y-5">
          {/* My Projects -> Materi */}
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <ListChecks size={18} className="text-[var(--accent)]" aria-hidden />
                Modul Belajar
              </h3>
              <div className="flex items-center gap-2">
                <span className="btn btn-outline btn-sm">
                  Minggu Ini <ChevronDown size={14} aria-hidden />
                </span>
                <Link href="/jenis-wayang" className="btn btn-soft btn-sm">
                  Lihat Semua
                </Link>
              </div>
            </div>

            <div className="hidden grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 md:grid">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)]">
                Materi
              </span>
              <span className="w-28 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)]">
                Bagian
              </span>
              <span className="w-24 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)]">
                Status
              </span>
            </div>

            {PROJECTS.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="table-row grid-cols-[1fr_auto] hover:!bg-[var(--surface-muted)] md:grid-cols-[1fr_auto_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--text)]">{p.name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{p.desc}</p>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  <span className="avatar avatar-sm">{p.assignee.charAt(0)}</span>
                  <span className="w-20 truncate text-sm text-[var(--text-muted)]">{p.assignee}</span>
                </div>
                <div className="flex justify-end">
                  <span className={statusChip(p.tone)}>{p.status}</span>
                </div>
              </Link>
            ))}
          </section>

          {/* Schedule */}
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <Calendar size={18} className="text-[var(--accent)]" aria-hidden />
                Jadwal Belajar
              </h3>
              <button className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-soft)]">
                <MoreHorizontal size={18} aria-hidden />
              </button>
            </div>

            {/* Day picker */}
            <div className="grid grid-cols-7 gap-1 px-4 py-4 md:px-6">
              {SCHEDULE.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 text-center">
                  <span className="text-[0.7rem] font-bold text-[var(--text-soft)]">{d.dow}</span>
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                      d.active
                        ? "bg-[var(--accent)] text-white shadow-[var(--shadow-sm)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border)]">
              {EVENTS.map((e) => (
                <Link key={e.title} href="/belajar-menggambar" className="table-row grid-cols-[auto_1fr_auto] hover:!bg-[var(--surface-muted)]">
                  <span className="h-15 w-1.5 rounded-full" style={{ background: e.tone }} aria-hidden />
                  <div className="min-w-0 text-left">
                    <p className="truncate font-semibold text-[var(--text)]">{e.title}</p>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Clock size={12} aria-hidden /> {e.time}
                    </p>
                  </div>
                  <span className="chip chip-muted hidden sm:inline-flex">{e.tag}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ===== Right column ===== */}
        <div className="space-y-5">
          {/* Notes */}
          <section className="card overflow-hidden">
            <div className="card-head">
              <h3>
                <StickyNote size={18} className="text-[var(--accent)]" aria-hidden />
                Catatan Belajar
              </h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {NOTES.map((n) => (
                <Link key={n.title} href={n.href} className="flex items-start gap-3 px-6 py-4 hover:bg-[var(--surface-muted)]">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem] font-bold ${
                      n.done
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border-strong)] text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${n.done ? "text-[var(--text-muted)]" : "text-[var(--text)]"}`}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">{n.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick start CTA */}
          <section className="card overflow-hidden">
            <div className="p-6">
              <p className="eyebrow mb-2">Mulai praktik</p>
              <h3>Gambar siluet wayang sekarang</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Pilih tokoh, gunakan garis panduan, lalu nilai hasil menggambar Anda secara otomatis.
              </p>
              <Link href="/belajar-menggambar" className="btn btn-primary mt-4 w-full">
                Buka Kanvas Menggambar <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </section>

          {/* Sumber terpercaya */}
          <section className="card overflow-hidden">
            <div className="p-6">
              <p className="eyebrow mb-2">Referensi</p>
              <h3>Sumber terpercaya &amp; terakreditasi</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Materi disusun dari UNESCO, UNIMA, Kemenparekraf, dan jurnal terakreditasi.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="chip chip-muted">UNESCO 2003/2008</span>
                <span className="chip chip-muted">UNIMA</span>
                <span className="chip chip-muted">Kemenparekraf</span>
                <span className="chip chip-muted">Jurnal Terakreditasi</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Search band (untuk keyword) */}
      <section className="card mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3>Cari materi yang ingin dipelajari</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Gunakan menu samping untuk menjelajahi jenis wayang, tokoh, sejarah, dan praktik menggambar.
            </p>
          </div>
          <Link href="/jenis-wayang" className="btn btn-outline self-start sm:self-auto">
            <Search size={16} aria-hidden /> Jelajahi Materi
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
  icon: Icon,
}: {
  value: string;
  label: string;
  tone: "info" | "success" | "danger" | "pending";
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}) {
  const tones: Record<string, string> = {
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    pending: "bg-[var(--pending-soft)] text-[var(--pending)]",
  };
  return (
    <div className="card flex items-center gap-3 px-4 py-3">
      <span className={`grid h-9 w-9 place-items-center rounded-full ${tones[tone]}`}>
        <Icon size={16} aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-lg font-bold text-[var(--text)]">{value}</p>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}
