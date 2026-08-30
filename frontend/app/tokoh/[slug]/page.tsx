import { notFound } from "next/navigation";
import { api, type Character } from "@/lib/api";
import { BackLink, SourceList, PointsList } from "@/components/ui";
import Link from "next/link";
import { PenTool } from "lucide-react";

// Fallback materi agar halaman tetap tampil bila backend sedang tidak aktif.
import { FALLBACK } from "./fallback";

export const dynamic = "force-dynamic";
export const revalidate = 120;
export const metadata = { title: "Detail Tokoh" };

export default async function TokohDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let character;
  const fallback = FALLBACK.find((c) => c.slug === slug);
  try {
    character = await api.characterDetail(slug);
  } catch {
    character = fallback ?? null;
  }
  if (!character) notFound();

  return (
    <div className="container-wrap py-6 md:py-8">
      <BackLink href="/tokoh" label="Kembali ke tokoh" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Panel siluet */}
        <aside className="space-y-4">
          <div className="canvas-frame card-pad">
            <p className="eyebrow mb-2">Wanda: {character.wanda || character.role}</p>
            <h1>{character.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{character.role}</span>
              {character.type && <span className="chip chip-muted">{character.type}</span>}
            </div>
          </div>
          <Link
            href={`/belajar-menggambar?tokoh=${character.slug}`}
            className="btn btn-primary w-full"
          >
            <PenTool size={16} aria-hidden />
            Belajar menggambar tokoh ini
          </Link>
        </aside>

        {/* Info */}
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">{character.summary}</p>
          <p className="leading-relaxed">{character.description}</p>

          {character.traits && character.traits.length > 0 && (
            <PointsList items={character.traits} title="Sifat / watak" />
          )}

          {character.origin && Object.keys(character.origin).length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(character.origin).map(([k, v]) => (
                <div key={k} className="card rounded-[var(--radius-md)] p-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)]">
                    {k.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-sm">{v}</p>
                </div>
              ))}
            </div>
          )}

          {character.related_stories && character.related_stories.length > 0 && (
            <div>
              <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)]">
                Kisah terkait
              </p>
              <div className="flex flex-wrap gap-2">
                {character.related_stories.map((s, i) => (
                  <span key={i} className="chip chip-muted">{s}</span>
                ))}
              </div>
            </div>
          )}

          <SourceList sources={character.sources} />
        </div>
      </div>
    </div>
  );
}
