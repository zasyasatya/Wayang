import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { BackLink, SourceList, PointsList, SectionHeading } from "@/components/ui";

export const generateStaticParams = async () => {
  const slugs = [
    "wayang-parwa",
    "wayang-ramayana",
    "wayang-wong",
    "wayang-calonarang",
    "wayang-cupak",
    "wayang-sasak",
    "wayang-arja",
    "wayang-tantri",
    "wayang-sapuh-leger",
    "wayang-kamasan",
  ];
  return slugs.map((slug) => ({ slug }));
};

export const metadata = {
  title: "Detail Jenis Wayang",
};

export default async function JenisWayangDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let material;
  try {
    material = await api.materialDetail(slug);
  } catch {
    if (slug === "wayang-parwa") {
      material = {
        id: "m1",
        slug: "wayang-parwa",
        name: "Wayang Parwa",
        category: "jenis-wayang",
        summary:
          "Pertunjukan wayang kulit paling populer di Bali yang bersumber dari wiracarita Mahabharata.",
        description:
          "Wayang Parwa merupakan pertunjukan wayang kulit paling terkenal di seluruh Pulau Dewata. Sesuai namanya, lakonnya bersumber dari Astadasa Parwa — 18 kitab wiracarita Mahabharata. Biasanya dipentaskan pada malam hari sebagai hiburan, namun ada juga ragam siang hari yang bersifat spiritual untuk upacara agama.",
        key_points: [
          "Sumber lakon: Mahabharata (Astadasa Parwa).",
          "Paling populer dan paling sering dipentaskan di Bali.",
          "Dipentaskan malam hari (hiburan) atau siang hari (ritual).",
          "Diiringi empat buah gender wayang.",
        ],
        details: {
          sumber_lakon: "Mahabharata (Astadasa Parwa)",
          waktu_pementasan: "Malam / siang (ritual)",
          musik_pengiring: "Gender wayang",
        },
        sources: [
          {
            title: "Wayang kulit Bali — Wikipedia",
            url: "https://id.wikipedia.org/wiki/Wayang_kulit_Bali",
          },
          {
            title: "Wayang — World Encyclopedia of Puppetry Arts (UNIMA)",
            url: "https://wepa.unima.org/en/wayang/",
          },
        ],
        images: [],
      };
    } else {
      notFound();
    }
  }

  if (!material) notFound();

  return (
    <div className="container-wrap py-12">
      <BackLink href="/jenis-wayang" label="Kembali ke jenis wayang" />
      <div className="mt-6 max-w-3xl">
        <p className="eyebrow mb-2">Jenis wayang Bali</p>
        <h1>{material.name}</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)]">{material.summary}</p>

        <p className="mt-6 leading-relaxed">{material.description}</p>

        <PointsList items={material.key_points} />

        {material.details && Object.keys(material.details).length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(material.details).map(([k, v]) => (
              <div
                key={k}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                  {k.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-sm">{v}</p>
              </div>
            ))}
          </div>
        )}

        <SourceList sources={material.sources} />

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <SectionHeading title="Lanjutkan belajar" />
          <div className="flex flex-wrap gap-3">
            <a href="/tokoh" className="btn btn-outline">Lihat Tokoh</a>
            <a href="/sejarah" className="btn btn-outline">Pelajari Sejarah</a>
          </div>
        </div>
      </div>
    </div>
  );
}
