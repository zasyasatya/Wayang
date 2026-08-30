import { api, type Material } from "@/lib/api";
import { SectionHeading, PointsList } from "@/components/ui";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const MATERIALS: Material[] = [
  {
    id: "m1",
    slug: "wayang-parwa",
    name: "Wayang Parwa",
    category: "jenis-wayang",
    summary:
      "Pertunjukan wayang kulit paling populer di Bali yang bersumber dari wiracarita Mahabharata.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m2",
    slug: "wayang-ramayana",
    name: "Wayang Ramayana",
    category: "jenis-wayang",
    summary: "Membawakan kisah Ramayana, sering disebut wayang ngrameyana di Bali.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m3",
    slug: "wayang-wong",
    name: "Wayang Wong",
    category: "jenis-wayang",
    summary: "Wayang yang diperankan oleh aktor manusia, langka dan historis di Bali.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m5",
    slug: "wayang-calonarang",
    name: "Wayang Calonarang",
    category: "jenis-wayang",
    summary: "Mengisahkan Calonarang, ratu sihir dari Dirah, dengan tema spiritual dan magis.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m6",
    slug: "wayang-cupak",
    name: "Wayang Cupak",
    category: "jenis-wayang",
    summary: "Mengisahkan Cupak Grantang, dua putra Bhatara Brahma yang berbeda watak.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m7",
    slug: "wayang-sasak",
    name: "Wayang Sasak",
    category: "jenis-wayang",
    summary: "Wayang berakulturasi Bali–Sasak dari Lombok dengan kisah Islam.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m8",
    slug: "wayang-arja",
    name: "Wayang Arja",
    category: "jenis-wayang",
    summary: "Diciptakan pada 1975, terinspirasi dari seni drama-tari Arja.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m9",
    slug: "wayang-tantri",
    name: "Wayang Tantri",
    category: "jenis-wayang",
    summary: "Wayang inovasi I Wayan Wija yang membawakan cerita hewan Hindu.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m11",
    slug: "wayang-sapuh-leger",
    name: "Wayang Sapuh Leger",
    category: "jenis-wayang",
    summary: "Wayang ruwatan yang dipentaskan untuk upacara penyucian.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
  {
    id: "m13",
    slug: "wayang-kamasan",
    name: "Seni Lukis Wayang Kamasan",
    category: "jenis-wayang",
    summary: "Gaya lukis klasik Bali yang meniru bentuk wayang kulit dari Kamasan, Klungkung.",
    description: "",
    key_points: [],
    details: {},
    sources: [],
    images: [],
  },
];

export const metadata = {
  title: "Jenis-Jenis Wayang Bali",
};

export default async function JenisWayangPage() {
  let items = MATERIALS;
  try {
    const data = await api.materials();
    items = data.items;
  } catch {
    // fallback ke data statis bila backend belum berjalan.
  }

  return (
    <div className="container-wrap py-12">
      <SectionHeading
        eyebrow="Materi 1 · Jenis Wayang"
        title="Jenis-Jenis Wayang Bali"
        subtitle="Wayang bukan satu bentuk saja. Di Bali berkembang banyak jenis, masing-masing dengan sumber cerita, musik, dan fungsinya yang berbeda."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <Link key={m.slug} href={`/jenis-wayang/${m.slug}`} className="card card-hover flex flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-hover)]">
                <BookOpen size={18} aria-hidden />
              </span>
              <h3 className="text-[1.05rem]">{m.name}</h3>
            </div>
            <p className="flex-1 text-sm text-[var(--text-muted)]">{m.summary}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-hover)]">
              Pelajari <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
