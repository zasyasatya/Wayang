import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { BackLink, SourceList, PointsList } from "@/components/ui";
import { MATERIAL_FALLBACK } from "./fallback";

export const dynamic = "force-dynamic";
export const revalidate = 120;
export const metadata = { title: "Detail Jenis Wayang" };

export default async function JenisWayangDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let material;
  const fallback = MATERIAL_FALLBACK.find((m) => m.slug === slug) ?? null;
  try {
    material = await api.materialDetail(slug);
  } catch {
    material = fallback;
  }
  if (!material) notFound();

  return (
    <div className="container-wrap py-6 md:py-8">
      <BackLink href="/jenis-wayang" label="Kembali ke jenis wayang" />
      <div className="mt-6 max-w-3xl">
        <p className="eyebrow mb-2">Jenis wayang Bali</p>
        <h1>{material.name}</h1>
        <p className="mt-3 text-lg text-[var(--text-muted)]">{material.summary}</p>

        <p className="mt-6 leading-relaxed">{material.description}</p>

        <PointsList items={material.key_points} />

        {material.details && Object.keys(material.details).length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(material.details).map(([k, v]) => (
              <div key={k} className="card rounded-[var(--radius-md)] p-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)]">
                  {k.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-sm">{v}</p>
              </div>
            ))}
          </div>
        )}

        <SourceList sources={material.sources} />

        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <h2 className="mb-4">Lanjutkan belajar</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/tokoh" className="btn btn-outline">Lihat Tokoh</a>
            <a href="/sejarah" className="btn btn-outline">Pelajari Sejarah</a>
          </div>
        </div>
      </div>
    </div>
  );
}
