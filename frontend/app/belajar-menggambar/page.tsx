"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  api,
  silhouetteSvgUrl,
  type Silhouette,
  type GradingResult,
  type DrawingLesson,
} from "@/lib/api";
import { SectionHeading } from "@/components/ui";
import { ConstructionOverlay } from "@/components/studio/ConstructionOverlay";
import {
  STUDIO_STEPS,
  STUDY_MODES,
  CONSTRUCT_BLUE,
  INK_BLACK,
  type StudioLayer,
  type StudyMode,
} from "@/lib/studioSteps";
import {
  PenTool,
  Undo2,
  Trash2,
  Wand2,
  Download,
  CheckCircle2,
  Info,
  Eye,
  Layers,
  Eraser,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Blend,
} from "lucide-react";

const CANVAS_W = 440;
const CANVAS_H = 640;

type Tool = "pen" | "eraser";

const FALLBACK_SIL: Silhouette[] = [
  {
    id: "arjuna",
    slug: "arjuna",
    name: "Arjuna",
    character_id: "arjuna",
    difficulty: "mudah",
    wanda: "alus",
    description: "Satria alus.",
    tips: ["Mulai dari garis gestur, bukan dari mata."],
    ref_points: [],
  },
];

export default function BelajarMenggambarPage() {
  const [sil, setSil] = useState<Silhouette[]>([]);
  const [lessons, setLessons] = useState<DrawingLesson[]>([]);
  const [selected, setSelected] = useState("arjuna");
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<StudyMode>("konstruksi");
  const [layer, setLayer] = useState<StudioLayer>("construct");
  const [showConstruct, setShowConstruct] = useState(true);
  const [compare, setCompare] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [strokeColor, setStrokeColor] = useState(CONSTRUCT_BLUE);
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState<Tool>("pen");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardKey, setBoardKey] = useState(0);
  const [theoryOpen, setTheoryOpen] = useState(false);

  const constructRef = useRef<HTMLCanvasElement | null>(null);
  const inkRef = useRef<HTMLCanvasElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const constructInk = useRef(false);
  const inkInk = useRef(false);
  const undoConstruct = useRef<string[]>([]);
  const undoInk = useRef<string[]>([]);

  const step = STUDIO_STEPS[stepIndex];
  const selectedObj = sil.find((s) => s.id === selected) ?? sil[0];

  useEffect(() => {
    (async () => {
      try {
        const data = await api.silhouettes();
        if (data.items.length) {
          setSil(data.items);
          const q =
            typeof window !== "undefined"
              ? new URLSearchParams(window.location.search).get("tokoh")
              : null;
          const match = q && data.items.find((s) => s.id === q || s.slug === q);
          setSelected(match ? match.id : data.items[0].id);
        }
      } catch {
        setSil(FALLBACK_SIL);
      }
    })();
    (async () => {
      try {
        const data = await api.drawing();
        setLessons(data.items);
      } catch {
        setLessons([]);
      }
    })();
  }, []);

  useEffect(() => {
    setLayer(step.layer);
    setStrokeColor(step.suggestedColor);
    setLineWidth(step.suggestedWidth);
    setTool("pen");
  }, [step]);

  const resetBoard = useCallback(() => {
    setBoardKey((k) => k + 1);
    constructInk.current = false;
    inkInk.current = false;
    undoConstruct.current = [];
    undoInk.current = [];
    setResult(null);
    setError(null);
    setCompare(false);
  }, []);

  const chooseTokoh = useCallback(
    (id: string) => {
      setSelected(id);
      setResult(null);
      setError(null);
      resetBoard();
    },
    [resetBoard]
  );

  const activeCanvas = useCallback(() => {
    return layer === "construct" ? constructRef.current : inkRef.current;
  }, [layer]);

  const getPos = useCallback((e: React.PointerEvent) => {
    const plate = plateRef.current;
    const canvas = constructRef.current ?? inkRef.current;
    if (!plate || !canvas) return { x: 0, y: 0 };
    const rect = plate.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  }, []);

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const canvas = activeCanvas();
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = lineWidth;
      ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : strokeColor;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();
      if (layer === "construct") constructInk.current = true;
      else inkInk.current = true;
    },
    [activeCanvas, layer, lineWidth, strokeColor, tool]
  );

  const snapshot = useCallback(() => {
    const canvas = activeCanvas();
    if (!canvas) return;
    const stack = layer === "construct" ? undoConstruct : undoInk;
    stack.current.push(canvas.toDataURL("image/png"));
    if (stack.current.length > 30) stack.current.shift();
  }, [activeCanvas, layer]);

  const handleDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      drawing.current = true;
      last.current = getPos(e);
      snapshot();
      plateRef.current?.setPointerCapture?.(e.pointerId);
    },
    [getPos, snapshot]
  );

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing.current || !last.current) return;
      const p = getPos(e);
      drawLine(last.current, p);
      last.current = p;
    },
    [drawLine, getPos]
  );

  const handleUp = useCallback(() => {
    drawing.current = false;
    last.current = null;
  }, []);

  const undo = useCallback(() => {
    const canvas = activeCanvas();
    if (!canvas) return;
    const stack = layer === "construct" ? undoConstruct : undoInk;
    const snap = stack.current.pop();
    if (!snap) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      if (layer === "construct") constructInk.current = false;
      else inkInk.current = false;
      return;
    }
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = snap;
  }, [activeCanvas, layer]);

  const mergeCanvases = useCallback((includeConstruct: boolean) => {
    const ink = inkRef.current;
    const con = constructRef.current;
    const out = document.createElement("canvas");
    out.width = CANVAS_W;
    out.height = CANVAS_H;
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#F4E6C8";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (includeConstruct && con) ctx.drawImage(con, 0, 0);
    if (ink) ctx.drawImage(ink, 0, 0);
    return out;
  }, []);

  const onGrade = useCallback(async () => {
    if (!inkInk.current && !constructInk.current) {
      setError("Kanvas masih kosong. Ikuti langkah 1–4: gestur, proporsi, blocking, lalu kontur.");
      return;
    }
    if (!inkInk.current) {
      setError("Gambar kontur dengan tinta (langkah 4) sebelum dinilai. Konstruksi biru tidak dinilai.");
      return;
    }
    setGrading(true);
    setError(null);
    setResult(null);
    try {
      const merged = mergeCanvases(false);
      if (!merged) throw new Error("Kanvas tidak siap.");
      const res = await api.grade(merged.toDataURL("image/png"), selected);
      setResult(res);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal menilai gambar. Pastikan backend berjalan."
      );
    } finally {
      setGrading(false);
    }
  }, [mergeCanvases, selected]);

  const download = useCallback(() => {
    const merged = mergeCanvases(showConstruct);
    if (!merged) return;
    const a = document.createElement("a");
    a.href = merged.toDataURL("image/png");
    a.download = `wayang-${selected}-langkah${step.n}.png`;
    a.click();
  }, [mergeCanvases, selected, showConstruct, step.n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
      if (e.key >= "1" && e.key <= "7") {
        setStepIndex(Number(e.key) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo]);

  const guidesForCanvas = useMemo(() => {
    if (mode === "observasi") return [];
    if (mode === "jiplak") return step.guides.filter((g) => g === "contour" || g === "axis");
    return step.guides;
  }, [mode, step.guides]);

  const theory = lessons[stepIndex] ?? lessons[0];

  return (
    <div className="container-wrap py-6 md:py-8">
      <SectionHeading
        eyebrow="Materi 4 · Studio Atelir"
        title="Gambar dari Acuan"
        subtitle="Metode konstruksi mahasiswa seni rupa: observasi, proporsi nawa sanga, blocking-in, kontur, landmark, detail, lalu perhalusan. Lembar acuan di kiri — kanvas Anda di kanan, seukuran (sight-size)."
      />

      {/* Rel langkah */}
      <ol className="studio-step-rail mb-5">
        {STUDIO_STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setStepIndex(i)}
              className={`studio-step ${i === stepIndex ? "is-active" : ""} ${
                i < stepIndex ? "is-done" : ""
              }`}
            >
              <span className="studio-step-n">{s.n}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{s.title}</span>
                <span className="hidden truncate text-[0.7rem] text-[var(--text-soft)] sm:block">
                  {s.subtitle}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Instruksi langkah */}
      <div className="card mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <p className="eyebrow mb-1">
              Langkah {step.n} dari 7 · {step.layer === "construct" ? "Pensil konstruksi" : "Tinta"}
            </p>
            <h2 className="text-lg">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{step.instruction}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft size={14} aria-hidden /> Sebelumnya
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={stepIndex === STUDIO_STEPS.length - 1}
              onClick={() => setStepIndex((i) => Math.min(STUDIO_STEPS.length - 1, i + 1))}
            >
              Lanjut <ChevronRight size={14} aria-hidden />
            </button>
          </div>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {step.doList.map((d) => (
            <li
              key={d}
              className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] px-3 py-2 text-xs leading-relaxed text-[var(--text)]"
            >
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-xs text-[var(--pending)]">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
          {step.caution}
        </p>
      </div>

      {/* Pilih tokoh */}
      <div className="mb-5">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
          Lembar acuan tokoh
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sil.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => chooseTokoh(s.id)}
              className={`studio-thumb ${selected === s.id ? "is-active" : ""}`}
            >
              <span className="studio-thumb-art">
                <img src={silhouetteSvgUrl(s.slug)} alt="" draggable={false} />
              </span>
              <span className="mt-1.5 block text-xs font-semibold">{s.name}</span>
              <span className="block text-[0.65rem] text-[var(--text-soft)]">
                {s.wanda ?? s.difficulty}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_16.5rem]">
        {/* Acuan */}
        <section className="canvas-frame overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">
                Lembar acuan
              </p>
              <p className="text-sm font-semibold">
                {selectedObj
                  ? `${selectedObj.name}${selectedObj.wanda ? ` · wanda ${selectedObj.wanda}` : ""}`
                  : "Acuan"}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
              Label
            </label>
          </div>
          <div className="studio-plate">
            {selectedObj && (
              <img
                src={silhouetteSvgUrl(selectedObj.slug)}
                alt={`Acuan ${selectedObj.name}`}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />
            )}
            <ConstructionOverlay
              construction={selectedObj?.construction}
              refPoints={selectedObj?.ref_points}
              guides={step.guides}
              focus={step.focus}
              showLabels={showLabels}
            />
          </div>
          {selectedObj && (
            <div className="border-t border-[var(--border)] px-4 py-3">
              <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                {selectedObj.description}
              </p>
            </div>
          )}
        </section>

        {/* Kanvas */}
        <section className="canvas-frame overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--text-soft)]">
                Kanvas Anda
              </p>
              <p className="text-sm font-semibold">
                {layer === "construct" ? "Lapisan konstruksi" : "Lapisan tinta"}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={undo}
                className="btn btn-ghost !px-2.5 !py-1 text-xs"
                title="Urungkan (Ctrl+Z)"
              >
                <Undo2 size={14} aria-hidden /> Urungkan
              </button>
              <button
                type="button"
                onClick={resetBoard}
                className="btn btn-ghost !px-2.5 !py-1 text-xs"
              >
                <Trash2 size={14} aria-hidden /> Bersihkan
              </button>
            </div>
          </div>
          <div
            ref={plateRef}
            className="studio-plate cursor-crosshair"
            style={{ touchAction: "none" }}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerLeave={handleUp}
          >
            {mode === "jiplak" && selectedObj && (
              <img
                src={silhouetteSvgUrl(selectedObj.slug)}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-20"
                draggable={false}
              />
            )}
            <canvas
              key={`c-${boardKey}`}
              ref={constructRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="absolute inset-0 h-full w-full"
              style={{
                opacity: showConstruct ? (layer === "ink" ? 0.45 : 1) : 0,
                pointerEvents: "none",
              }}
            />
            <canvas
              key={`i-${boardKey}`}
              ref={inkRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="absolute inset-0 h-full w-full"
              style={{ pointerEvents: "none" }}
            />
            <ConstructionOverlay
              construction={selectedObj?.construction}
              refPoints={selectedObj?.ref_points}
              guides={guidesForCanvas}
              focus={step.focus}
              showLabels={false}
              muted
            />
            {compare && selectedObj && (
              <img
                src={silhouetteSvgUrl(selectedObj.slug)}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-35 mix-blend-multiply"
                draggable={false}
              />
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
            <span>
              Mode {mode} · langkah {step.n}
            </span>
            <span>{compare ? "Membandingkan dengan acuan" : "Sight-size 1:1"}</span>
          </div>
        </section>

        {/* Alat */}
        <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
          <div className="card p-4">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
              Lapisan & alat
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLayer("construct");
                  setStrokeColor(CONSTRUCT_BLUE);
                  setTool("pen");
                }}
                className={`btn ${layer === "construct" && tool === "pen" ? "btn-primary" : "btn-outline"}`}
              >
                <PenTool size={15} aria-hidden /> Konstruksi
              </button>
              <button
                type="button"
                onClick={() => {
                  setLayer("ink");
                  setStrokeColor(INK_BLACK);
                  setTool("pen");
                }}
                className={`btn ${layer === "ink" && tool === "pen" ? "btn-primary" : "btn-outline"}`}
              >
                <PenTool size={15} aria-hidden /> Tinta
              </button>
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={`btn col-span-2 ${tool === "eraser" ? "btn-danger" : "btn-outline"}`}
              >
                <Eraser size={15} aria-hidden /> Penghapus (lapisan aktif)
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  Ketebalan: <span className="font-bold text-[var(--text)]">{lineWidth}px</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">Warna</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
                    aria-label="Warna goresan"
                  />
                  {[
                    [CONSTRUCT_BLUE, "Pensil konstruksi"],
                    [INK_BLACK, "Tinta"],
                    ["#b45309", "Oker"],
                    ["#9f1239", "Merah Kamasan"],
                  ].map(([c, label]) => (
                    <button
                      key={c}
                      type="button"
                      title={label}
                      aria-label={label}
                      onClick={() => setStrokeColor(c)}
                      className="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-[var(--border)]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
              Cara memakai acuan
            </p>
            <div className="space-y-2">
              {STUDY_MODES.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer gap-2 rounded-[var(--radius-md)] border px-3 py-2 ${
                    mode === m.id
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="study-mode"
                    checked={mode === m.id}
                    onChange={() => setMode(m.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{m.title}</span>
                    <span className="block text-[0.7rem] leading-relaxed text-[var(--text-muted)]">
                      {m.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConstruct}
                  onChange={(e) => setShowConstruct(e.target.checked)}
                />
                <Layers size={14} aria-hidden /> Tampilkan konstruksi
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                />
                <Blend size={14} aria-hidden /> Bandingkan dengan acuan
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onGrade} className="btn btn-primary col-span-2" disabled={grading}>
              <Wand2 size={16} aria-hidden />
              {grading ? "Menilai…" : "Nilai kontur"}
            </button>
            <button type="button" onClick={download} className="btn btn-outline">
              <Download size={15} aria-hidden /> Unduh
            </button>
            <button type="button" onClick={resetBoard} className="btn btn-outline">
              <Trash2 size={15} aria-hidden /> Ulang
            </button>
          </div>

          {selectedObj && (
            <div className="card p-4">
              <p className="mb-2 flex items-center gap-1.5 font-semibold text-[var(--text)]">
                <Eye size={15} aria-hidden /> Catatan acuan
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-xs text-[var(--text-muted)]">
                {selectedObj.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {error && (
        <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5">
          <ResultPanel result={result} />
        </div>
      )}

      {theory && (
        <div className="card mt-5 overflow-hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            onClick={() => setTheoryOpen((o) => !o)}
          >
            <span className="flex items-center gap-2 font-semibold">
              <BookOpen size={16} className="text-[var(--accent)]" aria-hidden />
              Teori langkah ini · {theory.title}
            </span>
            <span className="text-xs text-[var(--text-soft)]">{theoryOpen ? "Tutup" : "Buka"}</span>
          </button>
          {theoryOpen && (
            <div className="space-y-4 border-t border-[var(--border)] px-5 py-4">
              <p className="text-sm text-[var(--text-muted)]">{theory.summary}</p>
              {theory.steps.map((s) => (
                <div key={s.title}>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{s.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultPanel({ result }: { result: GradingResult }) {
  const gradeColor =
    result.grade === "A"
      ? "var(--success)"
      : result.grade === "B"
        ? "var(--info)"
        : result.grade === "C"
          ? "var(--accent)"
          : result.grade.startsWith("D")
            ? "var(--pending)"
            : "var(--danger)";

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-14 w-14 place-items-center rounded-2xl text-2xl font-bold"
            style={{ background: "var(--accent-soft)", color: gradeColor }}
          >
            {result.grade}
          </span>
          <div>
            <p className="text-3xl font-bold">{result.total_score.toFixed(0)}</p>
            <p className="text-sm text-[var(--text-muted)]">{result.grade_label}</p>
          </div>
        </div>
        <span className="chip">
          <CheckCircle2 size={14} aria-hidden />
          {result.silhouette_name}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {result.dimensions.map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{d.name}</span>
              <span className="font-semibold">{d.score.toFixed(0)} / 100</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, d.score)}%`, background: gradeColor }}
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-soft)]">{d.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
          Masukan untuk Anda
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--text)]">
          {result.feedback.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
