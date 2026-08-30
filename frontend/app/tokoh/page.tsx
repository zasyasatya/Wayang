"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type Character } from "@/lib/api";
import { SectionHeading } from "@/components/ui";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

const FALLBACK: Character[] = [
  {
    id: "c1",
    slug: "rama",
    name: "Rama",
    role: "Satria",
    wanda: "Alus",
    type: "Tokoh utama & titisan Wisnu",
    summary: "Pangeran Ayodhya dan titisan Dewa Wisnu yang menegakkan dharma.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
  {
    id: "c3",
    slug: "arjuna",
    name: "Arjuna",
    role: "Satria",
    wanda: "Alus",
    type: "Pandawa",
    summary: "Kesatria Pandawa yang tampan, sakti, dan menjadi tokoh favorit.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
  {
    id: "c4",
    slug: "bima",
    name: "Bima",
    role: "Satria",
    wanda: "Gagah",
    type: "Pandawa",
    summary: "Kesatria Pandawa kedua yang kuat, jujur, dan berwanda gagah.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
  {
    id: "c7",
    slug: "hanoman",
    name: "Hanoman",
    role: "Satria",
    wanda: "Gagah",
    type: "Kesatria kera",
    summary: "Kesatria kera sakti yang setia kepada Rama.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
  {
    id: "c11",
    slug: "tualen",
    name: "Tualen",
    role: "Panasar",
    wanda: "Panasar",
    type: "Pengasuh satria",
    summary: "Punakawan Bali yang mengasuh para kesatria.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
  {
    id: "c8",
    slug: "rahwana",
    name: "Rahwana",
    role: "Raksasa",
    wanda: "Denawa",
    type: "Antagonis Ramayana",
    summary: "Raja raksasa Alengka yang menculik Sita.",
    description: "",
    traits: [],
    origin: {},
    related_stories: [],
    sources: [],
  },
];

const ROLES = ["Semua", "Satria", "Panasar", "Raksasa", "Dewa", "Raja"];

export default function TokohPage() {
  const [items, setItems] = useState<Character[]>([]);
  const [role, setRole] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.characters();
        setItems(data.items.length ? data.items : FALLBACK);
      } catch {
        setItems(FALLBACK);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (role === "Semua") return items;
    return items.filter((c) => c.role.toLowerCase().includes(role.toLowerCase()));
  }, [items, role]);

  return (
    <div className="container-wrap py-12">
      <SectionHeading
        eyebrow="Materi 2 · Tokoh"
        title="Tokoh yang Berperan dalam Wayang Bali"
        subtitle="Setiap tokoh membawa wanda dan watak tersendiri — dari kesatria halus ('alus') hingga raksasa ('denawa') dan panasar (pelawak)."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`btn ${role === r ? "btn-primary" : "btn-outline"}`}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--text-muted)]">Memuat tokoh…</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/tokoh/${c.slug}`}
              className="card card-hover flex flex-col gap-3 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-hover)]">
                  <Users size={19} aria-hidden />
                </span>
                <span className="chip chip-muted">{c.wanda || c.role}</span>
              </div>
              <h3 className="text-[1.05rem]">{c.name}</h3>
              <p className="flex-1 text-sm text-[var(--text-muted)]">{c.summary}</p>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                {c.role}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
