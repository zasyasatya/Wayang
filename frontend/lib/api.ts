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

export interface ConstructionBlock {
  type: "ellipse" | "line";
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  label: string;
}

export interface ConstructionLandmark {
  id: string;
  label: string;
  x: number;
  y: number;
  zone: string;
}

export interface Construction {
  view: [number, number];
  bbox: { x: number; y: number; w: number; h: number };
  axis: { x1: number; y1: number; x2: number; y2: number };
  gesture: number[][];
  head: { cx: number; cy: number; rx: number; ry: number };
  proportion_lines: { y: number; label: string }[];
  unit: number;
  blocks: ConstructionBlock[];
  landmarks: ConstructionLandmark[];
  ground_y: number;
  face_box: { x: number; y: number; w: number; h: number };
  contour?: number[][];
}

export interface Silhouette {
  id: string;
  slug: string;
  name: string;
  character_id: string;
  difficulty: string;
  wanda?: string;
  description: string;
  tips: string[];
  ref_points: number[][];
  construction?: Construction;
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

export interface AdminUser {
  username: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: AdminUser;
}

/* Penyimpanan token admin (localStorage). */
const TOKEN_KEY = "wayang.adminToken";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null): void {
    if (typeof window === "undefined") return;
    try {
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* abaikan */
    }
  },
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };
  const token = tokenStore.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store", ...init, headers });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let msg = `Request gagal (${res.status})`;
    try {
      const parsed = JSON.parse(detail);
      if (typeof parsed?.detail === "string") msg = parsed.detail;
    } catch {
      if (detail) msg = `${msg}: ${detail.slice(0, 120)}`;
    }
    throw new Error(msg);
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
  // Autentikasi admin
  login: (username: string, password: string) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<AdminUser>("/auth/me"),
};

export function silhouetteSvgUrl(slug: string): string {
  return `${API_BASE}/silhouettes/${slug}/image`;
}
