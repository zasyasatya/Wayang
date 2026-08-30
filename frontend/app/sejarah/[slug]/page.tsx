import { notFound } from "next/navigation";
import { api, type HistorySection } from "@/lib/api";
import { BackLink, SourceList, PointsList } from "@/components/ui";
import { FALLBACK } from "./fallback";

export const dynamic = "force-dynamic";
export const revalidate = 120;
export const metadata = { title: "Detail Sejarah" };

export default async function SejarahDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let section: HistorySection | null = null;
  const fallback = FALLBACK.find((h) => h.slug === slug) ?? null;
  try {
    section = await api.historyDetail(slug);
  } catch {
    section = fallback;
  }
  if (!section) notFound();

  return (
    <div className="container-wrap py-6 md:py-8">
      <BackLink href="/sejarah" label="Kembali ke sejarah" />
      <div className="mx-auto mt-6 max-w-3xl">
        <span className="chip chip-muted">{section.period}</span>
        <h1 className="mt-3">{section.title}</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">{section.summary}</p>

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
