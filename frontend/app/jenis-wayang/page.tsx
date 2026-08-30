import { api, type Material } from "@/lib/api";
import { SectionHeading } from "@/components/ui";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

// Fallback bila backend tidak aktif.
const FALLBACK: Partial<Material>[] = [
  { slug: "wayang-parwa", name: "Wayang Parwa", summary: "Wayang kulit paling populer di Bali, bersumber dari Mahabharata." },
  { slug: "wayang-ramayana", name: "Wayang Ramayana", summary: "Membawakan kisah Ramayana (ngrameyana) di Bali." },
  { slug: "wayang-wong", name: "Wayang Wong", summary: "Wayang yang diperankan aktor manusia (wayang orang Bali)." },
  { slug: "wayang-gambuh", name: "Wayang Gambuh", summary: "Wayang langka yang mengisahkan cerita Panji." },
  { slug: "wayang-calonarang", name: "Wayang Calonarang", summary: "Kisah Calonarang dengan tema spiritual dan magis." },
  { slug: "wayang-cupak", name: "Wayang Cupak", summary: "Kisah Cupak Grantang, dua putra Bhatara Brahma." },
  { slug: "wayang-sasak", name: "Wayang Sasak", summary: "Wayang akulturasi Bali–Sasak dari Lombok, tema Islam." },
  { slug: "wayang-arja", name: "Wayang Arja", summary: "Diciptakan 1975, terinspirasi drama-tari Arja." },
  { slug: "wayang-tantri", name: "Wayang Tantri", summary: "Wayang inovasi I Wayan Wija, cerita hewan Hindu." },
  { slug: "wayang-kamasan", name: "Seni Lukis Kamasan", summary: "Gaya lukis klasik Bali yang meniru bentuk wayang kulit." },
  { slug: "wayang-sapuh-leger", name: "Wayang Sapuh Leger", summary: "Wayang ruwatan untuk upacara penyucian." },
  { slug: "wayang-lemah", name: "Wayang Lemah", summary: "Wayang siang hari yang bersifat sakral untuk upacara." },
];

export const metadata = { title: "Jenis-Jenis Wayang Bali" };

export default async function JenisWayangPage() {
  let items: Material[] = [];
  let fromApi = false;
  try {
    const data = await api.materials();
    items = data.items;
    fromApi = items.length > 0;
  } catch {
    /* fallback */
  }
  const display = fromApi ? items : (FALLBACK as Material[]);

  return (
    <div className="container-wrap py-6 md:py-8">
      <SectionHeading
        eyebrow="Materi 1 · Jenis Wayang"
        title="Jenis-Jenis Wayang Bali"
        subtitle="Wayang bukan satu bentuk saja. Di Bali berkembang banyak jenis, masing-masing dengan sumber cerita, musik, dan fungsi yang berbeda."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((m) => (
          <Link key={m.slug} href={`/jenis-wayang/${m.slug}`} className="card card-hover flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <BookOpen size={18} aria-hidden />
              </span>
              <h3 className="leading-snug">{m.name}</h3>
            </div>
            <p className="flex-1 text-sm text-[var(--text-muted)]">{m.summary}</p>
            <div className="flex items-center justify-between">
              <span className="chip chip-muted">Jenis Wayang</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
                Buka <ArrowRight size={14} aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
