/**
 * Klien API ringan untuk backend FastAPI.
 * Selalu memakai path relatif ("/api/...") sehingga bekerja baik di dev
 * (proksi Next) maupun di production (reverse proxy).
 */

// Di browser, gunakan path relatif (proksi Next). Di server (SSR), fetch butuh
// URL absolut, jadi arahkan langsung ke backend. Keduanya mengarah ke sumber yang sama.
const isServer = typeof window === "undefined";
const SERVER_API_BASE =
  process.env.WAYANG_BACKEND_URL ?? "http://localhost:8000/api";
const API_BASE = isServer ? SERVER_API_BASE : "/api";

export interface SourceLink {
  title: string;
  url: string;
}

export interface Material {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  key_points: string[];
  details: Record<string, string>;
  sources: SourceLink[];
  images: { title?: string; url?: string }[];
}

export interface Character {
  id: string;
  slug: string;
  name: string;
  wikipedia_name?: string | null;
  role: string;
  wanda?: string | null;
  type?: string | null;
  summary: string;
  description: string;
  traits: string[];
  origin: Record<string, string>;
  related_stories: string[];
  sources: SourceLink[];
}

export interface HistorySection {
  id: string;
  slug: string;
  title: string;
  period: string;
  summary: string;
  content: { heading: string; text: string }[];
  key_points: string[];
  sources: SourceLink[];
}

export interface DrawingLesson {
  id: string;
  slug: string;
  title: string;
  level: string;
  summary: string;
  steps: { title: string; text: string }[];
  key_points: string[];
  sources: SourceLink[];
}

export interface Silhouette {
  id: string;
  slug: string;
  name: string;
  character_id: string;
  difficulty: string;
  description: string;
  tips: string[];
  ref_points: number[][];
}

export interface GradingDimension {
  name: string;
  score: number;
  percentage: number;
  label: string;
  note: string;
}

export interface GradingResult {
  silhouette_id: string;
  silhouette_name: string;
  total_score: number;
  grade: string;
  grade_label: string;
  feedback: string[];
  dimensions: GradingDimension[];
  metrics: Record<string, number>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Request gagal (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  materials: () =>
    request<{ items: Material[]; total: number }>("/materials"),
  materialDetail: (slug: string) =>
    request<Material>(`/materials/detail/${slug}`),
  characters: (role?: string) =>
    request<{ items: Character[]; total: number }>(
      `/characters${role ? `?role=${encodeURIComponent(role)}` : ""}`
    ),
  characterDetail: (slug: string) =>
    request<Character>(`/characters/${slug}`),
  history: () => request<{ items: HistorySection[]; total: number }>("/history"),
  historyDetail: (slug: string) => request<HistorySection>(`/history/${slug}`),
  drawing: () =>
    request<{ items: DrawingLesson[]; total: number }>("/drawing"),
  drawingDetail: (slug: string) => request<DrawingLesson>(`/drawing/${slug}`),
  silhouettes: () =>
    request<{ items: Silhouette[]; total: number }>("/silhouettes"),
  grade: (image: string, silhouette_id: string) =>
    request<GradingResult>("/grade", {
      method: "POST",
      body: JSON.stringify({ image, silhouette_id }),
    }),
};

export function silhouetteSvgUrl(slug: string): string {
  return `${API_BASE}/silhouettes/${slug}/image`;
}
