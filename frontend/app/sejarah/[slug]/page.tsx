import { notFound } from "next/navigation";
import { api, type HistorySection } from "@/lib/api";
import { BackLink, SourceList, PointsList } from "@/components/ui";

export async function generateStaticParams() {
  return ["asal-usul", "masa-majapahit", "pengakuan-unesco", "filosofi-dan-simbol", "perkembangan-kontemporer"].map(
    (slug) => ({ slug })
  );
}

export const metadata = { title: "Detail Sejarah" };

export default async function SejarahDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let section: HistorySection | null = null;
  try {
    section = await api.historyDetail(slug);
  } catch {
    section = null;
  }
  if (!section) notFound();

  return (
    <div className="container-wrap py-12">
      <BackLink href="/sejarah" label="Kembali ke sejarah" />
      <div className="mx-auto mt-6 max-w-3xl">
        <span className="chip chip-muted">{section.period}</span>
        <h1 className="mt-3">{section.title}</h1>
        <p className="mt-4 text-lg text-[var(--text-muted)]">{section.summary}</p>

        <div className="mt-8 space-y-8">
          {section.content.map((block, i) => (
            <section key={i}>
              <h3>{block.heading}</h3>
              <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{block.text}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <PointsList items={section.key_points} />
          <SourceList sources={section.sources} />
        </div>
      </div>
    </div>
  );
}
