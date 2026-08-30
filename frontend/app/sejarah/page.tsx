import { api, type HistorySection } from "@/lib/api";
import { SectionHeading } from "@/components/ui";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

const FALLBACK: HistorySection[] = [
  {
    id: "h1",
    slug: "asal-usul",
    title: "Asal Usul Wayang Kulit Bali",
    period: "Tradisi & Pengaruh Hindu-Buddha",
    summary:
      "Wayang kulit Bali berakar pada pengaruh budaya Hindu dari India yang masuk melalui Jawa dan kemudian diadaptasi menjadi gaya khas Bali.",
    content: [],
    key_points: [],
    sources: [],
  },
  {
    id: "h2",
    slug: "masa-majapahit",
    title: "Masa Majapahit dan Kedatangan ke Bali",
    period: "Abad ke-13 – ke-15",
    summary:
      "Wayang kulit Bali banyak dipengaruhi perkembangan di Jawa, terutama pada masa Majapahit; setelah keruntuhannya, seniman dan bangsawan Hindu-Jawa bermigrasi ke Bali.",
    content: [],
    key_points: [],
    sources: [],
  },
  {
    id: "h4",
    slug: "pengakuan-unesco",
    title: "Pengakuan UNESCO sebagai Warisan Budaya Dunia",
    period: "2003 & 2008",
    summary:
      "Wayang kulit diakui UNESCO sebagai Masterpiece of Oral and Intangible Heritage of Humanity pada 2003, dan masuk Representative List pada 2008.",
    content: [],
    key_points: [],
    sources: [],
  },
  {
    id: "h5",
    slug: "filosofi-dan-simbol",
    title: "Filosofi dan Simbolisme Wayang Bali",
    period: "Nilai & Makna",
    summary:
      "Wayang Bali sarat dengan makna filosofis, dari gunungan (kayonan) hingga tata letak kiwa-tengen, yang mencerminkan keseimbangan alam dan manusia.",
    content: [],
    key_points: [],
    sources: [],
  },
  {
    id: "h6",
    slug: "perkembangan-kontemporer",
    title: "Perkembangan Kontemporer",
    period: "1970-an – kini",
    summary:
      "Dari inovasi Wayang Tantri dan Wayang Arja hingga wayang kontemporer di ISI Denpasar, pewayangan Bali terus berkembang dan beradaptasi.",
    content: [],
    key_points: [],
    sources: [],
  },
];

export const metadata = { title: "Sejarah Wayang Bali" };

export default async function SejarahPage() {
  let items = FALLBACK;
  try {
    const data = await api.history();
    items = data.items.length ? data.items : FALLBACK;
  } catch {
    // fallback
  }

  return (
    <div className="container-wrap py-6 md:py-8">
      <SectionHeading
        eyebrow="Materi 3 · Sejarah"
        title="Sejarah Wayang Bali"
        subtitle="Telusuri perjalanan wayang kulit Bali dari pengaruh Hindu-Majapahit, puncak keemasan Bali Hindu Klasik, hingga pengakuan dunia dan perkembangan modern."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((h) => (
          <Link key={h.slug} href={`/sejarah/${h.slug}`} className="card card-hover flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Clock size={18} aria-hidden />
              </span>
              <span className="chip chip-muted">{h.period}</span>
            </div>
            <h3 className="leading-snug">{h.title}</h3>
            <p className="flex-1 text-sm text-[var(--text-muted)]">{h.summary}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
              Baca sejarah <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
