"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, silhouetteSvgUrl, type Silhouette, type GradingResult } from "@/lib/api";
import { SectionHeading } from "@/components/ui";
import {
  PenTool,
  Undo2,
  Trash2,
  Layers,
  Wand2,
  Download,
  CheckCircle2,
  Info,
} from "lucide-react";

const CANVAS_W = 440;
const CANVAS_H = 640;

type Tool = "pen" | "eraser";

export default function BelajarMenggambarPage() {
  const [sil, setSil] = useState<Silhouette[]>([]);
  const [selected, setSelected] = useState<string>("arjuna");
  const [showGuide, setShowGuide] = useState(true);
  const [strokeColor, setStrokeColor] = useState("#2B1B12");
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState<Tool>("pen");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState(0); // force remount to clear
  const [drawCount, setDrawCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hasInk = useRef(false);
  const undoStack = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.silhouettes();
        if (data.items.length) {
          setSil(data.items);
          setSelected(data.items[0].id);
        }
      } catch {
        // fallback minimal agar halaman tetap terisi
        setSil([
          {
            id: "arjuna",
            slug: "arjuna",
            name: "Arjuna",
            character_id: "arjuna",
            difficulty: "mudah",
            description: "",
            tips: [],
            ref_points: [],
          },
        ]);
      }
    })();
  }, []);

  const selectedObj = sil.find((s) => s.id === selected);

  const getPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const drawLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const canvas = canvasRef.current;
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
      hasInk.current = true;
    },
    [lineWidth, strokeColor, tool]
  );

  const handleDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      drawing.current = true;
      const p = getPos(e);
      last.current = p;
      // Simpan snapshot sebelum goresan baru untuk mendukung undo.
      const canvas = canvasRef.current;
      if (canvas) {
        undoStack.current.push(canvas.toDataURL("image/png"));
        if (undoStack.current.length > 30) undoStack.current.shift();
      }
      canvasRef.current?.setPointerCapture?.(e.pointerId);
      setDrawCount((c) => c + 1);
    },
    [getPos]
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
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

  const clearCanvas = useCallback(() => {
    setCanvasKey((k) => k + 1);
    hasInk.current = false;
    undoStack.current = [];
    setResult(null);
    setError(null);
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = undoStack.current.pop();
    if (!snapshot) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      hasInk.current = undoStack.current.length > 0 || snapshot !== "";
    };
    img.src = snapshot;
  }, []);

  const onGrade = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasInk.current) {
      setError("Gambar masih kosong. Silakan gambar siluet terlebih dahulu.");
      return;
    }
    setGrading(true);
    setError(null);
    setResult(null);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const res = await api.grade(dataUrl, selected);
      setResult(res);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal menilai gambar. Pastikan backend berjalan."
      );
    } finally {
      setGrading(false);
    }
  }, [selected]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `wayang-${selected}.png`;
    a.click();
  }, [selected]);

  return (
    <div className="container-wrap py-12">
      <SectionHeading
        eyebrow="Materi 4 · Praktik"
        title="Belajar Menggambar Pola & Siluet"
        subtitle="Pilih tokoh, gunakan garis bantu sebagai panduan, lalu gambar di atas kanvas. Setelah selesai, nilai hasilnya secara otomatis."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Kontrol kiri */}
        <aside className="space-y-5">
          <div className="card p-5">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
              Pilih siluet tokoh
            </p>
            <div className="flex flex-wrap gap-2">
              {sil.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelected(s.id);
                    setResult(null);
                    setError(null);
                  }}
                  className={`btn ${selected === s.id ? "btn-primary" : "btn-outline"}`}
                >
                  {s.name}
                  <span className="ml-1 text-[0.68rem] opacity-70">{s.difficulty}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
              Alat menggambar
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTool("pen")}
                className={`btn ${tool === "pen" ? "btn-primary" : "btn-outline"}`}
              >
                <PenTool size={15} aria-hidden /> Pensil
              </button>
              <button
                onClick={() => setTool("eraser")}
                className={`btn ${tool === "eraser" ? "btn-danger" : "btn-outline"}`}
              >
                <Layers size={15} aria-hidden /> Penghapus
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  Ketebalan goresan: <span className="font-bold text-[var(--text)]">{lineWidth}px</span>
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
                <label className="mb-1.5 block text-sm text-[var(--text-muted)]">Warna tinta</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded border border-[var(--border)]"
                    aria-label="Warna tinta"
                  />
                  {[
                    ["#2B1B12", "Cokelat tinta"],
                    ["#97281c", "Merah batik"],
                    ["#8a2d6b", "Magenta"],
                    ["#c9942f", "Emas"],
                    ["#1f6f5a", "Hijau"],
                  ].map(([c, label]) => (
                    <button
                      key={c}
                      title={label}
                      aria-label={label}
                      onClick={() => setStrokeColor(c)}
                      className="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-[var(--border)]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={showGuide}
                    onChange={(e) => setShowGuide(e.target.checked)}
                  />
                  Tampilkan garis panduan
                </label>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={clearCanvas} className="btn btn-ghost">
                <Trash2 size={15} aria-hidden /> Bersihkan
              </button>
              <button onClick={download} className="btn btn-ghost">
                <Download size={15} aria-hidden /> Unduh
              </button>
            </div>
          </div>

          {selectedObj && (
            <div className="card p-5">
              <p className="mb-2 flex items-center gap-1.5 font-semibold text-[var(--text)]">
                <Info size={15} aria-hidden /> Tips menggambar {selectedObj.name}
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--text-muted)]">
                {selectedObj.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Kanvas */}
        <div className="space-y-4">
          <div className="canvas-frame">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
              <span className="text-sm font-semibold">
                {selectedObj ? `Siluet ${selectedObj.name}` : "Kanvas"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  className="btn btn-ghost !py-1 !px-2.5 text-xs"
                  title="Batalkan goresan terakhir"
                >
                  <Undo2 size={14} aria-hidden /> Urungkan
                </button>
                <button
                  onClick={clearCanvas}
                  className="btn btn-ghost !py-1 !px-2.5 text-xs"
                  title="Hapus semua goresan"
                >
                  <Trash2 size={14} aria-hidden /> Bersihkan
                </button>
              </div>
            </div>
            <div className="canvas-board relative">
              <canvas
                key={canvasKey}
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="block h-auto w-full cursor-crosshair"
                style={{ touchAction: "none" }}
                onPointerDown={handleDown}
                onPointerMove={handleMove}
                onPointerUp={handleUp}
                onPointerLeave={handleUp}
              />
              {showGuide && selectedObj && (
                <div className="pointer-events-none absolute inset-0">
                  <img
                    src={silhouetteSvgUrl(selectedObj.slug)}
                    alt=""
                    className="h-full w-full object-contain opacity-15"
                    draggable={false}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text-muted)]">
              <span>Goresan aktif: {drawCount}</span>
              <span>Skala bantuan: {showGuide ? "Tampil" : "Sembunyi"}</span>
            </div>
          </div>

          {/* Aksi & hasil */}
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onGrade} className="btn btn-primary" disabled={grading}>
              <Wand2 size={16} aria-hidden />
              {grading ? "Menilai…" : "Nilai Hasil Gambar"}
            </button>
            <button onClick={clearCanvas} className="btn btn-outline">
              <Trash2 size={16} aria-hidden /> Gambar Ulang
            </button>
          </div>

          {error && (
            <p className="rounded-[var(--radius-md)] border border-[var(--danger)]/40 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          {result && (
            <ResultPanel result={result} />
          )}
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: GradingResult }) {
  const gradeColor =
    result.grade === "A"
      ? "var(--success)"
      : result.grade === "B"
      ? "var(--teal-500)"
      : result.grade === "C"
      ? "var(--accent)"
      : result.grade.startsWith("D")
      ? "var(--ember-500)"
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
            <p className="font-display text-3xl">{result.total_score.toFixed(0)}</p>
            <p className="text-sm text-[var(--text-muted)]">{result.grade_label}</p>
          </div>
        </div>
        <span className="chip">
          <CheckCircle2 size={14} aria-hidden />
          {result.silhouette_name}
        </span>
      </div>

      {/* Dimensi */}
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
                style={{ width: `${d.score}%`, background: gradeColor }}
              />
            </div>
            <p className="mt-1 text-xs text-[var(--text-soft)]">{d.note}</p>
          </div>
        ))}
      </div>

      {/* Umpan balik */}
      <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4">
        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
          Masukan untuk Anda
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--text)]">
          {result.feedback.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
