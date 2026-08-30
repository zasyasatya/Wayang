import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  PenTool,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/ui";

const FEATURES = [
  {
    href: "/jenis-wayang",
    icon: BookOpen,
    title: "Jenis-Jenis Wayang Bali",
    desc: "Mengenal wayang Parwa, Ramayana, Gambuh, Calonarang, Cupak, Sasak, hingga wayang lemah dan Kamasan.",
    tag: "Materi",
  },
  {
    href: "/tokoh",
    icon: Users,
    title: "Tokoh yang Berperan",
    desc: "Dari Rama dan Arjuna hingga Bima, Hanoman, serta panasar Tualen, Merdah, Delem, dan Sangut.",
    tag: "Karakter",
  },
  {
    href: "/sejarah",
    icon: Clock,
    title: "Sejarah & Filosofi",
    desc: "Dari pengaruh Hindu-Majapahit hingga pengakuan UNESCO serta makna simbolik gunungan.",
    tag: "Histori",
  },
  {
    href: "/belajar-menggambar",
    icon: PenTool,
    title: "Belajar Menggambar Pola",
    desc: "Panduan proporsi, menggambar muka dan badan, hingga latihan siluet yang dinilai otomatis.",
    tag: "Praktik",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(circle_at_20%_20%,var(--accent),transparent_30%),radial-gradient(circle_at_80%_10%,var(--batik-400),transparent_25%),radial-gradient(circle_at_60%_90%,var(--teal-500),transparent_30%)]" />
        <div className="container-wrap py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="chip">
                <Sparkles size={14} aria-hidden />
                Warisan budaya dunia — UNESCO 2003
              </span>
              <h1>
                Mengenal &amp; Menggambar
                <br />
                <span className="text-[var(--accent-hover)]">Wayang Bali</span>
              </h1>
              <p className="max-w-xl text-lg text-[var(--text-muted)]">
                Platform belajar budaya wayang Bali yang ramah untuk semua orang.
                Kenali jenis-jenisnya, tokoh yang berperan, pelajari sejarahnya,
                lalu berlatih menggambar pola dan siluet dengan bimbingan visual.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/jenis-wayang" className="btn btn-primary">
                  Mulai Belajar
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="/belajar-menggambar" className="btn btn-outline">
                  <PenTool size={16} aria-hidden />
                  Coba Menggambar
                </Link>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-[var(--text-muted)]">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[var(--success)]" aria-hidden />
                  Sumber terpercaya &amp; terakreditasi
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[var(--success)]" aria-hidden />
                  Cocok untuk pemula
                </li>
              </ul>
            </div>

            {/* Ilustrasi panel */}
            <div className="hidden lg:block">
              <div className="card relative mx-auto max-w-md p-8">
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-[var(--accent)]/15 blur-xl" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[var(--batik-400)]/10 blur-xl" />
                <div className="mx-auto grid h-52 w-40 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--cream-50)] shadow-[inset_0_2px_20px_rgba(36,21,9,0.05)]">
                  <svg viewBox="0 0 220 340" className="h-44 w-auto" aria-hidden>
                    <path
                      d="M110,6 L88,38 L84,44 L76,52 L66,60 L70,96 L62,110 L56,150 L80,160 L84,190 L60,210 L58,250 L40,336 L180,336 L166,250 L164,210 L142,190 L146,160 L170,150 L164,110 L156,96 L152,60 L142,52 L134,44 L130,38 L110,6 Z"
                      fill="#2B1B12"
                    />
                  </svg>
                </div>
                <p className="mt-6 text-center font-display text-lg">
                  Wayang Kulit Bali
                </p>
                <p className="text-center text-sm text-[var(--text-muted)]">
                  Boneka kulit yang hidup dalam bayang dan cerita
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="chip chip-muted">Parwa</span>
                  <span className="chip chip-muted">Ramayana</span>
                  <span className="chip chip-muted">Arja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="container-wrap py-12">
        <SectionHeading
          eyebrow="Jelajahi materi"
          title="Empat pilar belajar"
          subtitle="Setiap bagian dirancang agar mudah dipahami, dari pengenalan budaya hingga praktik menggambar."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="card card-hover flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-hover)]">
                  <f.icon size={22} aria-hidden />
                </span>
                <span className="chip chip-muted">{f.tag}</span>
              </div>
              <h3 className="text-[1.05rem] leading-snug">{f.title}</h3>
              <p className="flex-1 text-sm text-[var(--text-muted)]">{f.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-hover)]">
                Buka <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BAND SUMBER */}
      <section className="container-wrap py-12">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-alt)] px-6 py-10 text-center md:px-12">
          <h2>Belajar dari sumber yang dapat dipercaya</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">
            Materi disusun berdasarkan rujukan resmi dan akademik — termasuk
            pengakuan UNESCO, World Encyclopedia of Puppetry Arts (UNIMA),
            situs Kementerian Pariwisata &amp; Ekonomi Kreatif, jurnal terakreditasi,
            serta ensiklopedia. Setiap halaman menyertakan tautan sumber.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["UNESCO 2003/2008", "UNIMA", "Kemenparekraf", "Jurnal Terakreditasi"].map(
              (t) => (
                <span key={t} className="chip chip-muted">{t}</span>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
