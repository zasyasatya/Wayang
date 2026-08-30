"""Mesin penilaian hasil menggambar siluet wayang Bali.

Prinsip penilaian:
1. Gambar pengguna di-rasterisasi menjadi mask (tinta).
2. Mask dinormalisasi (dipusatkan + diskalakan) pada kanvas tetap.
3. Referensi siluet direpresentasikan sebagai himpunan titik kontur.
4. Skor dihitung dari dua dimensi:
   - ``merit``  : seberapa dekat tinta pengguna berada di sekitar kontur referensi.
   - ``coverage``: seberapa besar kontur referensi yang digambar/diikuti oleh pengguna.
"""
from __future__ import annotations

import base64
import binascii
import io
from typing import Any

import numpy as np
from PIL import Image, ImageOps

try:
    from scipy.spatial import cKDTree  # type: ignore
    from scipy.ndimage import binary_dilation  # type: ignore

    _HAS_SCIPY = True
except ImportError:  # pragma: no cover - fallback
    _HAS_SCIPY = False

from ..config import settings


def _decode_image(data_url: str) -> np.ndarray:
    """Membaca data-URL base64 PNG menjadi array grayscale (0..255)."""
    payload = data_url.split(",", 1)[1] if "," in data_url else data_url
    try:
        raw = base64.b64decode(payload)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("Gambar tidak valid: base64 tidak dapat didekode.") from exc

    try:
        img = Image.open(io.BytesIO(raw))
    except Exception as exc:  # noqa: BLE001
        raise ValueError("Gambar tidak valid: bukan file gambar yang dapat dibaca.") from exc

    img = ImageOps.exif_transpose(img).convert("L")
    # Ambang untuk mengubah piksel abu-abu menjadi tinta hitam.
    array = np.asarray(img, dtype=np.float32)
    return array


def _ink_mask(array: np.ndarray, threshold: float = 128.0) -> np.ndarray:
    """Array boolean: True = ada tinta (goresan) pada piksel tersebut."""
    return array < threshold


def _normalize_and_center(
    mask: np.ndarray, canvas: int, margin: float = 0.05
) -> np.ndarray:
    """Pusatkan & skala mask sehingga isi mengisi kanvas paling banyak, lalu pad ke kanvas."""
    ys, xs = np.where(mask)
    if ys.size == 0:
        return np.zeros((canvas, canvas), dtype=bool)

    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    w = max(1, x1 - x0 + 1)
    h = max(1, y1 - y0 + 1)

    scale = (canvas * (1 - 2 * margin)) / max(w, h)
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))

    sub = mask[y0 : y1 + 1, x0 : x1 + 1].astype(np.uint8) * 255
    sub_img = Image.fromarray(sub).resize((new_w, new_h), Image.LANCZOS)
    resized = np.asarray(sub_img, dtype=np.uint8) > 100

    out = np.zeros((canvas, canvas), dtype=bool)
    off_x = (canvas - new_w) // 2
    off_y = (canvas - new_h) // 2
    out[off_y : off_y + new_h, off_x : off_x + new_w] = resized
    return out


def _normalize_ref_points(
    points: list[list[int]], canvas: int, margin: float = 0.05
) -> np.ndarray:
    """Skala titik kontur referensi ke kanvas yang sama dengan mask."""
    pts = np.asarray(points, dtype=np.float64)
    if pts.size == 0:
        return pts.reshape(-1, 2)
    x0, x1 = pts[:, 0].min(), pts[:, 0].max()
    y0, y1 = pts[:, 1].min(), pts[:, 1].max()
    w = max(1.0, x1 - x0)
    h = max(1.0, y1 - y0)
    scale = (canvas * (1 - 2 * margin)) / max(w, h)

    new_w = w * scale
    new_h = h * scale
    off_x = (canvas - new_w) / 2.0
    off_y = (canvas - new_h) / 2.0

    out_x = (pts[:, 0] - x0) * scale + off_x
    out_y = (pts[:, 1] - y0) * scale + off_y
    return np.stack([out_x, out_y], axis=1)


def _dilate(mask: np.ndarray, iterations: int) -> np.ndarray:
    if _HAS_SCIPY:
        return binary_dilation(mask, iterations=iterations)
    # Fallback sederhana memakai rolling (murah, cukup untuk pengujian).
    k = 2 * iterations + 1
    from PIL import ImageFilter

    img = Image.fromarray((mask * 255).astype(np.uint8))
    img = img.filter(ImageFilter.MaxFilter(k))
    return np.asarray(img, dtype=np.uint8) > 100


def _nearest_distance_tree(points: np.ndarray) -> cKDTree:
    return cKDTree(points)


def grade_drawing(
    image: str,
    ref_points: list[list[int]],
    reference_difficulty: str = "mudah",
    canvas: int | None = None,
    tolerance_ratio: float | None = None,
) -> dict[str, Any]:
    """Menilai satu gambar pengguna terhadap satu referensi siluet.

    Mengembalikan dict berisi skor, label, umpan balik, dan metrik detil.
    """
    canvas = int(canvas or settings.grading_canvas_size)
    tolerance_ratio = tolerance_ratio if tolerance_ratio is not None else settings.grading_tolerance

    try:
        gray = _decode_image(image)
    except ValueError as exc:
        return {
            "valid": False,
            "error": str(exc),
            "total_score": 0.0,
            "grade": "E",
            "grade_label": "Tidak Dapat Dinilai",
            "dimensions": [],
            "feedback": [f"Gambar tidak dapat dibaca: {exc}", "Coba muat ulang gambar atau gambar ulang."],
            "metrics": {},
        }

    mask = _ink_mask(gray)
    if mask.sum() < 20:
        return {
            "valid": False,
            "error": "Gambar kosong.",
            "total_score": 0.0,
            "grade": "E",
            "grade_label": "Tanpa Goresan",
            "dimensions": [
                {"name": "Precision", "score": 0.0, "percentage": 0.0, "label": "Kosong",
                 "note": "Tidak terdeteksi goresan pada kanvas."}
            ],
            "feedback": ["Gambar masih kosong. Silakan gambar garis siluet terlebih dahulu."],
            "metrics": {"ink_pixels": 0},
        }

    ink = _normalize_and_center(mask, canvas)
    ref = _normalize_ref_points(ref_points, canvas)

    ink_pts = np.column_stack(np.where(ink))  # (y, x)
    # Balik menjadi (x, y) untuk konsistensi koordinat.
    ink_pts_xy = ink_pts[:, [1, 0]].astype(np.float64)

    tol_px = tolerance_ratio * canvas

    # 1) Merit = proporsi tinta yang berada dekat kontur referensi.
    if ref.shape[0] > 0:
        tree_ref = _nearest_distance_tree(ref)
        dist_ink_to_ref, _ = tree_ref.query(ink_pts_xy)
        in_band = (dist_ink_to_ref <= tol_px).sum()
        merit = in_band / max(1, len(ink_pts_xy))
        avg_dist_ink = float(np.mean(dist_ink_to_ref)) if dist_ink_to_ref.size else 0.0
    else:
        merit = 0.0
        avg_dist_ink = 0.0

    # 2) Coverage = seberapa besar kontur referensi yang diikuti.
    if ink_pts_xy.shape[0] > 0:
        tree_ink = _nearest_distance_tree(ink_pts_xy)
        dist_ref_to_ink, _ = tree_ink.query(ref)
        covered = (dist_ref_to_ink <= tol_px).sum()
        coverage = covered / max(1, ref.shape[0])
        avg_dist_ref = float(np.mean(dist_ref_to_ink)) if dist_ref_to_ink.size else 0.0
    else:
        coverage = 0.0
        avg_dist_ref = 0.0

    # 3) Kepadatan tinta (bonus kecil agar terlihat "menggambar" bukan menebalkan satu titik).
    filled = int(ink.sum())
    density_norm = filled / (canvas * canvas)

    # 4) Skor gabungan berbobot.
    merit_w = settings.GRADING_MERIT_WEIGHT
    coverage_w = settings.GRADING_COVERAGE_WEIGHT
    raw = merit_w * merit + coverage_w * coverage

    # Penyesuaian kesulitan (referensi lebih sulit sedikit dimaafkan).
    difficulty_penalty = {"mudah": 0.9, "sedang": 0.95, "sulit": 1.0}.get(reference_difficulty, 0.95)
    total = float(np.clip(raw / difficulty_penalty, 0.0, 1.0))

    grade, grade_label = _to_grade(total)

    feedback = _build_feedback(merit, coverage, avg_dist_ink, avg_dist_ref, filled, grade_label)
    dimensions = [
        {
            "name": "Ketepatan Bentuk (Merit)",
            "score": round(merit * 100, 1),
            "percentage": round(merit, 4),
            "label": _label_band(merit),
            "note": "Seberapa dekat garis gambar Anda berada pada kontur siluet.",
        },
        {
            "name": "Kelengkapan Kontur (Coverage)",
            "score": round(coverage * 100, 1),
            "percentage": round(coverage, 4),
            "label": _label_band(coverage),
            "note": "Seberapa besar bagian kontur referensi yang sudah digambar.",
        },
        {
            "name": "Ketekunan Menggambar",
            "score": round(density_norm * 100, 1),
            "percentage": round(density_norm, 4),
            "label": _label_band(density_norm),
            "note": "Seberapa rajin/tebal goresan yang dibuat (kepadatan tinta).",
        },
    ]

    return {
        "valid": True,
        "total_score": round(total * 100, 1),
        "grade": grade,
        "grade_label": grade_label,
        "dimensions": dimensions,
        "feedback": feedback,
        "metrics": {
            "merit": round(merit, 4),
            "coverage": round(coverage, 4),
            "density": round(density_norm, 4),
            "avg_distance_ink_to_ref": round(avg_dist_ink, 1),
            "avg_distance_ref_to_ink": round(avg_dist_ref, 1),
            "ink_pixels": filled,
        },
    }


def _to_grade(total: float) -> tuple[str, str]:
    if total >= 0.9:
        return "A", "Luar Biasa"
    if total >= 0.8:
        return "B", "Sangat Baik"
    if total >= 0.7:
        return "C", "Bagus"
    if total >= 0.55:
        return "D", "Cukup"
    if total >= 0.4:
        return "D-", "Perlu Berlatih"
    return "E", "Terus Berlatih"


def _label_band(value: float) -> str:
    if value >= 0.85:
        return "Sangat Baik"
    if value >= 0.7:
        return "Baik"
    if value >= 0.5:
        return "Cukup"
    if value >= 0.3:
        return "Kurang"
    return "Perlu Latihan"


def _build_feedback(
    merit: float,
    coverage: float,
    avg_dist_ink: float,
    avg_dist_ref: float,
    filled: int,
    grade_label: str,
) -> list[str]:
    feedback: list[str] = []
    if merit >= 0.75:
        feedback.append("Bentuk garis Anda sangat dekat dengan kontur wayang. Pertahankan!.")
    elif merit >= 0.5:
        feedback.append("Bentuk garis sudah mendekati, coba telusuri lagi garis luar siluet dengan lebih rapi.")
    else:
        feedback.append("Garis mulai menyimpang dari kontur. Nyalakan mode Konstruksi atau bandingkan dengan lembar acuan di kiri.")

    if coverage >= 0.75:
        feedback.append("Anda berhasil mengikuti hampir seluruh kontur siluet. Bagus!.")
    elif coverage >= 0.5:
        feedback.append("Sebagian kontur sudah tergambar; lengkapi bagian kepala dan badan hingga tertutup.")
    else:
        feedback.append("Masih ada banyak bagian kontur yang belum digambar. Selesaikan blocking, lalu telusuri garis luar dari mahkota ke kaki.")

    if avg_dist_ink < 12:
        feedback.append("Rata-rata jarak garis ke siluet tipis (presisi tinggi).")
    elif avg_dist_ink > 30:
        feedback.append("Garis Anda agak jauh dari siluet; usahakan tetap di dalam jalur.")

    if filled < 2500:
        feedback.append("Gunakan goresan yang lebih penuh/tebal agar bentuk lebih terbaca.")
    else:
        feedback.append("Ketekunan menggambar Anda sudah baik.")

    feedback.append(f"Hasil penilaian: {grade_label}. Terus berlatih agar makin menyatu dengan budaya wayang Bali.")
    return feedback
