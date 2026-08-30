"""Menghasilkan lembar acuan wayang (SVG) + data konstruksi atelir.

Setiap tokoh dibangun sebagai **profil samping** (konvensi wayang kulit/Kamasan),
bukan siluet frontal. Dari kerangka yang sama kita turunkan:

- kontur luar (untuk penilaian + overlay kontur)
- goresan dalam (mata, gelung, kain) agar acuan terbaca sebagai plat gambar
- data konstruksi: garis gestur, sumbu tegak, nawa sanga, blocking, landmark

Jalankan:  python scripts/generate_silhouettes.py
"""
from __future__ import annotations

import json
import math
import os
from typing import Any, Iterable

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(HERE, "..", "app", "data"))
ASSETS_DIR = os.path.abspath(os.path.join(HERE, "..", "app", "assets", "silhouettes"))

W, H = 220, 340
Point = tuple[float, float]


# ---------------------------------------------------------------------------
# Geometri
# ---------------------------------------------------------------------------
def _hypot(a: Point, b: Point) -> float:
    return math.hypot(b[0] - a[0], b[1] - a[1])


def densify(pts: list[Point], max_dist: float = 7.0) -> list[Point]:
    """Sisipkan titik di sepanjang poligon tertutup agar penilaian lebih halus."""
    if len(pts) < 2:
        return pts
    out: list[Point] = []
    n = len(pts)
    for i in range(n):
        a = pts[i]
        b = pts[(i + 1) % n]
        out.append(a)
        dist = _hypot(a, b)
        steps = int(dist // max_dist)
        for s in range(1, steps):
            t = s / steps
            out.append((a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])))
    return out


def cubic_path(pts: list[Point], closed: bool = True) -> str:
    """Catmull-Rom → cubic Bézier SVG, supaya kontur wayang mengalir."""
    if len(pts) < 2:
        return ""
    pts = [(float(x), float(y)) for x, y in pts]
    if closed:
        ext = [pts[-1], *pts, pts[0], pts[1]]
        start_i, end_i = 1, len(ext) - 2
    else:
        ext = [pts[0], *pts, pts[-1]]
        start_i, end_i = 1, len(ext) - 1

    d = [f"M{ext[start_i][0]:.1f},{ext[start_i][1]:.1f}"]
    for i in range(start_i, end_i - 1):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        c1x = p1[0] + (p2[0] - p0[0]) / 6.0
        c1y = p1[1] + (p2[1] - p0[1]) / 6.0
        c2x = p2[0] - (p3[0] - p1[0]) / 6.0
        c2y = p2[1] - (p3[1] - p1[1]) / 6.0
        d.append(f"C{c1x:.1f},{c1y:.1f} {c2x:.1f},{c2y:.1f} {p2[0]:.1f},{p2[1]:.1f}")
    if closed:
        d.append("Z")
    return " ".join(d)


def poly_attr(pts: Iterable[Point]) -> str:
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)


# ---------------------------------------------------------------------------
# Kontur tokoh — profil kiri, proporsi wayang (mahkota besar, hidung panjang)
# ---------------------------------------------------------------------------
def contour_arjuna() -> list[Point]:
    """Satria alus: gelung meruncing, hidung mancung, pinggang ramping."""
    return [
        (126, 8), (118, 20), (110, 34), (104, 46), (98, 54),
        (90, 58), (80, 62), (68, 68), (54, 76), (48, 82),
        (56, 86), (68, 90), (76, 96), (80, 104),
        (86, 114), (90, 124),
        (78, 132), (62, 142), (48, 156), (36, 148), (24, 140),
        (16, 134), (12, 130), (14, 142), (24, 152), (40, 162),
        (58, 156), (74, 148),
        (84, 160), (88, 176), (86, 194), (74, 208), (80, 220),
        (74, 236), (68, 260), (64, 286), (60, 310),
        (48, 322), (44, 328), (62, 330), (74, 312), (82, 286),
        (90, 258), (96, 236),
        (104, 258), (110, 286), (116, 314), (128, 328), (146, 330),
        (132, 316), (124, 288), (118, 258), (114, 230), (112, 208),
        (118, 188), (122, 170),
        (138, 162), (154, 174), (166, 188), (174, 196),
        (168, 180), (156, 164), (142, 150), (130, 138),
        (128, 122), (130, 104), (134, 86), (138, 68), (140, 50),
        (136, 32), (132, 18),
    ]


def contour_rama() -> list[Point]:
    """Raja: kirita tinggi meruncing, sikap lebih tegak."""
    return [
        (128, 4), (118, 16), (110, 30), (104, 44), (98, 54),
        (88, 58), (76, 64), (62, 74), (50, 84), (44, 90),
        (52, 94), (66, 98), (76, 104), (82, 114),
        (88, 126), (92, 138),
        (80, 146), (64, 156), (50, 170), (38, 162), (26, 152),
        (18, 146), (14, 142), (16, 154), (28, 166), (44, 174),
        (62, 168), (78, 158),
        (88, 172), (92, 192), (90, 212), (84, 228),
        (70, 236), (78, 250), (72, 276), (68, 300), (64, 318),
        (52, 328), (48, 332), (66, 334), (78, 318), (86, 294),
        (94, 268), (100, 248),
        (108, 268), (114, 296), (120, 320), (134, 332), (152, 334),
        (138, 320), (130, 294), (124, 266), (122, 244),
        (136, 232), (120, 218), (118, 196), (124, 176),
        (140, 168), (156, 180), (168, 194), (176, 202),
        (170, 186), (158, 170), (144, 156), (134, 144),
        (130, 126), (132, 106), (138, 84), (146, 62), (150, 42),
        (146, 24), (138, 10),
    ]


def contour_bima() -> list[Point]:
    """Satria gagah: jamang rendah, bahu lebar, lengan panjang, kuku pancanaka."""
    return [
        (118, 16), (108, 22), (96, 28), (90, 36), (86, 46),
        (78, 52), (66, 58), (52, 68), (42, 78), (38, 86),
        (48, 90), (62, 94), (74, 102), (80, 114),
        (78, 128), (70, 138),
        (52, 146), (34, 160), (18, 176), (8, 168), (2, 160),
        (0, 170), (10, 184), (24, 196), (44, 190), (62, 176),
        (76, 166),
        (86, 180), (92, 200), (96, 222), (94, 244),
        (86, 266), (78, 290), (74, 312), (70, 326),
        (56, 332), (52, 336), (74, 336), (88, 318), (98, 292),
        (108, 266), (114, 244),
        (124, 268), (132, 296), (140, 322), (156, 334), (176, 336),
        (160, 322), (150, 294), (142, 264), (138, 236), (140, 210),
        (148, 188), (158, 172),
        (176, 180), (190, 194), (200, 206), (208, 214),
        (200, 196), (186, 178), (170, 164), (156, 152),
        (148, 138), (146, 122), (148, 104), (150, 86), (146, 68),
        (138, 50), (130, 34), (124, 22),
    ]


def contour_gatotkaca() -> list[Point]:
    """Kesatria bersayap: mahkota tinggi + sapuan sayap di punggung."""
    return [
        (130, 4), (122, 16), (114, 30), (108, 44), (102, 54),
        (92, 58), (80, 64), (66, 72), (54, 80), (48, 86),
        (56, 90), (70, 94), (80, 102), (84, 112),
        (88, 124), (84, 136),
        (70, 146), (54, 158), (40, 172), (28, 164), (18, 154),
        (12, 148), (10, 158), (20, 172), (36, 182), (54, 176),
        (70, 164),
        (82, 176), (88, 196), (90, 218), (86, 240),
        (80, 262), (74, 286), (70, 308), (66, 322),
        (54, 330), (50, 334), (68, 334), (80, 316), (88, 290),
        (96, 264), (102, 242),
        (112, 266), (120, 294), (128, 318), (142, 332), (160, 334),
        (146, 318), (136, 290), (130, 260), (128, 232),
        (148, 214), (168, 198), (186, 178), (196, 158), (200, 136),
        (194, 118), (180, 108), (164, 116), (152, 132), (142, 150),
        (134, 164),
        (132, 146), (134, 126), (138, 106), (144, 84), (150, 62),
        (152, 42), (146, 24), (138, 10),
    ]


def contour_hanoman() -> list[Point]:
    """Wanara: moncong, ekor menonjol, badan kekar — telinga di goresan dalam."""
    return [
        (116, 14), (106, 22), (96, 32), (88, 44), (84, 56),
        (70, 62), (56, 72), (44, 84), (38, 94),
        (48, 98), (62, 102), (74, 110), (80, 122),
        (76, 134), (66, 144),
        (50, 154), (34, 168), (20, 180), (10, 172), (4, 164),
        (2, 174), (14, 188), (30, 196), (48, 188), (64, 174),
        (78, 164),
        (88, 178), (96, 200), (100, 222), (96, 244),
        (86, 266), (78, 290), (74, 312), (70, 326),
        (56, 332), (52, 336), (72, 336), (86, 318), (96, 290),
        (104, 262), (110, 240),
        (120, 262), (128, 290), (136, 318), (150, 332), (168, 336),
        (154, 320), (144, 292), (138, 262), (136, 234),
        # ekor sebagai tonjolan, bukan lubang
        (152, 220), (170, 212), (186, 198), (196, 180), (198, 164),
        (188, 158), (174, 170), (160, 186), (146, 198),
        (140, 180), (140, 156), (142, 132), (146, 108),
        (148, 86), (144, 66), (136, 48), (128, 32), (120, 20),
    ]


def contour_tualen() -> list[Point]:
    """Panasar: kepala bulat tanpa mahkota, perut buncit, kaki pendek."""
    return [
        (122, 36), (110, 40), (98, 50), (90, 64), (86, 80),
        (78, 90), (68, 98), (60, 108), (58, 118),
        (68, 122), (82, 128), (92, 140),
        (86, 154), (74, 166),
        (58, 174), (44, 186), (34, 196), (28, 190), (22, 182),
        (20, 192), (32, 206), (50, 214), (68, 206), (80, 194),
        # perut buncit
        (90, 208), (86, 228), (78, 248), (74, 264), (84, 274),
        # kaki pendek
        (92, 290), (90, 308), (84, 322), (72, 330), (68, 334),
        (88, 334), (100, 320), (108, 300), (114, 284),
        (126, 300), (134, 318), (148, 330), (166, 334),
        (154, 318), (144, 298), (138, 280),
        # punggung perut
        (156, 266), (170, 248), (178, 228), (176, 210),
        (168, 194), (178, 186), (188, 194),
        (182, 176), (168, 166), (156, 158),
        (150, 142), (148, 122), (150, 102), (148, 82),
        (140, 62), (132, 48), (126, 40),
    ]


# ---------------------------------------------------------------------------
# Goresan dalam (plat gambar)
# ---------------------------------------------------------------------------
def interior_alus(eye: Point) -> list[list[Point]]:
    ex, ey = eye
    return [
        # alis
        [(ex - 10, ey - 8), (ex + 4, ey - 10), (ex + 16, ey - 6)],
        # mata sipit
        [(ex - 8, ey), (ex + 2, ey - 3), (ex + 12, ey + 1), (ex + 2, ey + 4), (ex - 8, ey)],
        # telinga
        [(ex + 34, ey + 6), (ex + 42, ey + 10), (ex + 40, ey + 22), (ex + 30, ey + 20)],
        # gelung spiral
        [(ex + 28, ey - 28), (ex + 36, ey - 36), (ex + 32, ey - 20)],
        # kalung
        [(ex + 8, ey + 48), (ex + 18, ey + 58), (ex + 30, ey + 52)],
        # sabuk
        [(ex + 6, ey + 112), (ex + 28, ey + 116), (ex + 40, ey + 110)],
        # lipatan kain
        [(ex + 4, ey + 130), (ex + 10, ey + 160), (ex + 8, ey + 190)],
        [(ex + 22, ey + 128), (ex + 28, ey + 168)],
        # kelat bahu
        [(ex - 18, ey + 70), (ex - 8, ey + 74)],
    ]


def interior_gagah(eye: Point) -> list[list[Point]]:
    ex, ey = eye
    return [
        [(ex - 12, ey - 8), (ex + 8, ey - 10), (ex + 18, ey - 4)],
        [(ex - 10, ey + 2), (ex + 4, ey - 4), (ex + 14, ey + 4), (ex + 4, ey + 8), (ex - 10, ey + 2)],
        [(ex + 36, ey + 4), (ex + 46, ey + 10), (ex + 42, ey + 24), (ex + 32, ey + 20)],
        [(ex + 4, ey + 50), (ex + 20, ey + 62), (ex + 38, ey + 54)],
        [(ex + 8, ey + 118), (ex + 36, ey + 124), (ex + 52, ey + 116)],
        [(ex + 6, ey + 140), (ex + 14, ey + 180)],
        [(ex - 28, ey + 78), (ex - 16, ey + 84)],
    ]


def interior_kera(eye: Point) -> list[list[Point]]:
    ex, ey = eye
    return [
        [(ex - 8, ey - 6), (ex + 6, ey - 8), (ex + 14, ey - 2)],
        [(ex - 4, ey + 2), (ex + 6, ey - 2), (ex + 12, ey + 6), (ex + 4, ey + 8), (ex - 4, ey + 2)],
        # moncong
        [(ex - 18, ey + 10), (ex - 8, ey + 16), (ex + 4, ey + 14)],
        [(ex + 40, ey - 4), (ex + 50, ey + 2), (ex + 46, ey + 16), (ex + 36, ey + 12)],
        [(ex + 8, ey + 54), (ex + 24, ey + 64), (ex + 40, ey + 56)],
        [(ex + 10, ey + 124), (ex + 38, ey + 130)],
        # ekor ring
        [(ex + 48, ey + 130), (ex + 64, ey + 124), (ex + 70, ey + 108)],
    ]


def interior_panasar(eye: Point) -> list[list[Point]]:
    ex, ey = eye
    return [
        [(ex - 8, ey - 4), (ex + 8, ey - 6), (ex + 16, ey)],
        [(ex - 4, ey + 4), (ex + 6, ey), (ex + 12, ey + 8), (ex + 4, ey + 10), (ex - 4, ey + 4)],
        [(ex + 4, ey + 28), (ex + 10, ey + 36)],  # senyum
        [(ex + 8, ey + 70), (ex + 28, ey + 86), (ex + 48, ey + 78)],  # perut
        [(ex + 16, ey + 130), (ex + 40, ey + 138)],
        [(ex + 20, ey + 160), (ex + 28, ey + 200)],
    ]


# ---------------------------------------------------------------------------
# Kerangka + konstruksi atelir
# ---------------------------------------------------------------------------
NAWA_LABELS = [
    "0 · Puncak",
    "1 · Pangkal mahkota",
    "2 · Mata / hidung",
    "3 · Dagu",
    "4 · Dada",
    "5 · Pinggang",
    "6 · Pinggul",
    "7 · Lutut",
    "8 · Tungkai",
    "9 · Telapak",
]


def construction_from(
    skeleton: dict[str, Point],
    contour: list[Point],
    head_rx: float,
    head_ry: float,
    torso_rx: float,
    torso_ry: float,
) -> dict[str, Any]:
    xs = [p[0] for p in contour]
    ys = [p[1] for p in contour]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    height = max(1.0, y1 - y0)
    unit = height / 9.0

    plumb_x = skeleton["hip"][0]
    proportion_lines = [
        {"y": round(y0 + i * unit, 1), "label": NAWA_LABELS[i]}
        for i in range(10)
    ]

    def P(key: str) -> Point:
        return skeleton[key]

    gesture = [
        P("crown"),
        P("head"),
        P("chin"),
        P("shoulder"),
        P("hip"),
        P("knee_f"),
        P("ankle_f"),
    ]

    blocks = [
        {
            "type": "ellipse",
            "cx": round(P("head")[0], 1),
            "cy": round(P("head")[1], 1),
            "rx": round(head_rx, 1),
            "ry": round(head_ry, 1),
            "label": "Kepala",
        },
        {
            "type": "ellipse",
            "cx": round((P("shoulder")[0] + P("hip")[0]) / 2, 1),
            "cy": round((P("shoulder")[1] + P("hip")[1]) / 2, 1),
            "rx": round(torso_rx, 1),
            "ry": round(torso_ry, 1),
            "label": "Badan",
        },
        {
            "type": "line",
            "x1": P("shoulder")[0],
            "y1": P("shoulder")[1],
            "x2": P("elbow_f")[0],
            "y2": P("elbow_f")[1],
            "label": "Lengan atas",
        },
        {
            "type": "line",
            "x1": P("elbow_f")[0],
            "y1": P("elbow_f")[1],
            "x2": P("wrist_f")[0],
            "y2": P("wrist_f")[1],
            "label": "Lengan bawah",
        },
        {
            "type": "line",
            "x1": P("hip")[0],
            "y1": P("hip")[1],
            "x2": P("knee_f")[0],
            "y2": P("knee_f")[1],
            "label": "Paha",
        },
        {
            "type": "line",
            "x1": P("knee_f")[0],
            "y1": P("knee_f")[1],
            "x2": P("ankle_f")[0],
            "y2": P("ankle_f")[1],
            "label": "Tungkai",
        },
        {
            "type": "line",
            "x1": P("hip")[0],
            "y1": P("hip")[1],
            "x2": P("knee_b")[0],
            "y2": P("knee_b")[1],
            "label": "Paha belakang",
        },
        {
            "type": "line",
            "x1": P("knee_b")[0],
            "y1": P("knee_b")[1],
            "x2": P("ankle_b")[0],
            "y2": P("ankle_b")[1],
            "label": "Tungkai belakang",
        },
    ]

    landmarks = [
        {"id": "crown", "label": "Puncak mahkota", "x": P("crown")[0], "y": P("crown")[1], "zone": "head"},
        {"id": "eye", "label": "Mata", "x": P("eye")[0], "y": P("eye")[1], "zone": "head"},
        {"id": "nose", "label": "Ujung hidung", "x": P("nose")[0], "y": P("nose")[1], "zone": "head"},
        {"id": "chin", "label": "Dagu", "x": P("chin")[0], "y": P("chin")[1], "zone": "head"},
        {"id": "shoulder", "label": "Bahu", "x": P("shoulder")[0], "y": P("shoulder")[1], "zone": "body"},
        {"id": "elbow_f", "label": "Siku depan", "x": P("elbow_f")[0], "y": P("elbow_f")[1], "zone": "body"},
        {"id": "wrist_f", "label": "Pergelangan", "x": P("wrist_f")[0], "y": P("wrist_f")[1], "zone": "body"},
        {"id": "hip", "label": "Pinggul", "x": P("hip")[0], "y": P("hip")[1], "zone": "body"},
        {"id": "knee_f", "label": "Lutut depan", "x": P("knee_f")[0], "y": P("knee_f")[1], "zone": "body"},
        {"id": "ankle_f", "label": "Telapak depan", "x": P("ankle_f")[0], "y": P("ankle_f")[1], "zone": "body"},
        {"id": "knee_b", "label": "Lutut belakang", "x": P("knee_b")[0], "y": P("knee_b")[1], "zone": "body"},
        {"id": "ankle_b", "label": "Telapak belakang", "x": P("ankle_b")[0], "y": P("ankle_b")[1], "zone": "body"},
    ]
    for lm in landmarks:
        lm["x"] = round(float(lm["x"]), 1)
        lm["y"] = round(float(lm["y"]), 1)

    return {
        "view": [W, H],
        "bbox": {
            "x": round(x0, 1),
            "y": round(y0, 1),
            "w": round(x1 - x0, 1),
            "h": round(y1 - y0, 1),
        },
        "axis": {
            "x1": round(plumb_x, 1),
            "y1": round(y0, 1),
            "x2": round(plumb_x, 1),
            "y2": round(y1, 1),
        },
        "gesture": [[round(x, 1), round(y, 1)] for x, y in gesture],
        "head": {
            "cx": round(P("head")[0], 1),
            "cy": round(P("head")[1], 1),
            "rx": round(head_rx, 1),
            "ry": round(head_ry, 1),
        },
        "proportion_lines": proportion_lines,
        "unit": round(unit, 2),
        "blocks": blocks,
        "landmarks": landmarks,
        "contour": [[round(x, 1), round(y, 1)] for x, y in contour],
        "ground_y": round(y1, 1),
        "face_box": {
            "x": round(min(P("nose")[0], P("crown")[0]) - 8, 1),
            "y": round(y0 - 2, 1),
            "w": round(abs(P("shoulder")[0] - P("nose")[0]) + 28, 1),
            "h": round(P("chin")[1] - y0 + 16, 1),
        },
    }


def round_pts(pts: list[Point]) -> list[list[int]]:
    return [[int(round(x)), int(round(y))] for x, y in pts]


# ---------------------------------------------------------------------------
# SVG plat gambar
# ---------------------------------------------------------------------------
def svg_plate(
    contour: list[Point],
    interior: list[list[Point]],
    eye: Point,
    fill: str = "#2A2118",
) -> str:
    body = cubic_path(contour, closed=True)
    interior_paths = []
    for stroke in interior:
        if len(stroke) < 2:
            continue
        closed = _hypot(stroke[0], stroke[-1]) < 1.5
        interior_paths.append(
            f'<path d="{cubic_path(stroke, closed=closed)}" '
            f'fill="none" stroke="#E7D3A4" stroke-width="1.15" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
        )
    interiors = "\n  ".join(interior_paths)
    ex, ey = eye
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="440" height="640" role="img" aria-label="lembar acuan wayang">
  <rect width="{W}" height="{H}" fill="#F4E6C8"/>
  <rect x="8" y="8" width="{W-16}" height="{H-16}" fill="none" stroke="#CDB98A" stroke-width="0.6"/>
  <path d="{body}" fill="{fill}" stroke="#1A140E" stroke-width="1.4" stroke-linejoin="round"/>
  {interiors}
  <ellipse cx="{ex:.1f}" cy="{ey:.1f}" rx="6.5" ry="3.4" fill="#F4E6C8"/>
  <circle cx="{ex-1.5:.1f}" cy="{ey:.1f}" r="1.6" fill="#1A140E"/>
</svg>
"""


# ---------------------------------------------------------------------------
# Definisi tokoh
# ---------------------------------------------------------------------------
def define_figures() -> list[dict[str, Any]]:
    figures: list[dict[str, Any]] = []

    def add(
        slug: str,
        name: str,
        difficulty: str,
        wanda: str,
        description: str,
        tips: list[str],
        contour: list[Point],
        skeleton: dict[str, Point],
        interior: list[list[Point]],
        head_rx: float,
        head_ry: float,
        torso_rx: float,
        torso_ry: float,
    ) -> None:
        construction = construction_from(
            skeleton, contour, head_rx, head_ry, torso_rx, torso_ry
        )
        dense = densify(contour, max_dist=6.5)
        figures.append(
            {
                "id": slug,
                "slug": slug,
                "name": name,
                "character_id": slug,
                "difficulty": difficulty,
                "wanda": wanda,
                "description": description,
                "tips": tips,
                "ref_points": round_pts(dense),
                "construction": construction,
                "_contour": contour,
                "_interior": interior,
                "_eye": skeleton["eye"],
            }
        )

    add(
        "arjuna",
        "Arjuna",
        "mudah",
        "alus",
        "Lembar acuan satria alus — gelung meruncing, hidung mancung, pinggang ramping, sikap luwes menghadap kiri.",
        [
            "Mulai dari garis gestur (S halus dari mahkota ke telapak), bukan dari detail muka.",
            "Hidung mancung adalah landmark horizontal: ukur jarak ujung hidung ke sumbu kepala.",
            "Pinggang alus lebih sempit dari bahu — bandingkan lebar unit ke-5 dengan unit ke-4.",
        ],
        contour_arjuna(),
        {
            "crown": (126, 8),
            "head": (108, 62),
            "eye": (80, 64),
            "nose": (48, 82),
            "chin": (80, 104),
            "shoulder": (96, 128),
            "elbow_f": (48, 156),
            "wrist_f": (16, 134),
            "hip": (100, 210),
            "knee_f": (70, 270),
            "ankle_f": (52, 326),
            "knee_b": (112, 276),
            "ankle_b": (132, 326),
        },
        interior_alus((80, 64)),
        head_rx=28,
        head_ry=34,
        torso_rx=20,
        torso_ry=46,
    )

    add(
        "rama",
        "Rama",
        "mudah",
        "alus",
        "Lembar acuan raja — kirita bertingkat, sikap lebih tegak, badan ramping dengan mahkota yang makan hampir dua unit nawa sanga.",
        [
            "Mahkota Rama lebih tinggi dari Arjuna: unit 0–2 hampir seluruhnya hiasan kepala.",
            "Tetap jaga sumbu tegak (tali sipat) agar kirita tidak miring.",
            "Tangan depan setinggi dada — jangan turun ke pinggang.",
        ],
        contour_rama(),
        {
            "crown": (128, 4),
            "head": (108, 66),
            "eye": (78, 66),
            "nose": (46, 88),
            "chin": (82, 112),
            "shoulder": (98, 138),
            "elbow_f": (50, 168),
            "wrist_f": (18, 144),
            "hip": (102, 224),
            "knee_f": (74, 282),
            "ankle_f": (54, 330),
            "knee_b": (116, 288),
            "ankle_b": (138, 330),
        },
        interior_alus((78, 66)),
        head_rx=26,
        head_ry=32,
        torso_rx=18,
        torso_ry=44,
    )

    add(
        "bima",
        "Bima",
        "sedang",
        "gagah",
        "Lembar acuan satria gagah — jamang rendah, bahu lebar, lengan panjang, tangan besar (kuku pancanaka).",
        [
            "Bahu Bima hampir dua kali lebar Arjuna — blocking badan memakai oval gemuk, bukan silinder ramping.",
            "Jamang rendah: puncak kepala hanya sedikit di atas mata, bukan mahkota tinggi.",
            "Lengan depan sangat panjang; siku hampir di unit 5.",
        ],
        contour_bima(),
        {
            "crown": (118, 16),
            "head": (104, 58),
            "eye": (78, 56),
            "nose": (38, 86),
            "chin": (80, 114),
            "shoulder": (92, 140),
            "elbow_f": (34, 160),
            "wrist_f": (4, 164),
            "hip": (112, 236),
            "knee_f": (82, 292),
            "ankle_f": (60, 334),
            "knee_b": (134, 296),
            "ankle_b": (160, 334),
        },
        interior_gagah((78, 56)),
        head_rx=32,
        head_ry=36,
        torso_rx=28,
        torso_ry=52,
    )

    add(
        "gatotkaca",
        "Gatotkaca",
        "sedang",
        "gagah",
        "Lembar acuan kesatria bersayap — mahkota tinggi, badan gagah, sapuan sayap di punggung sebagai massa belakang.",
        [
            "Gambar sayap sebagai massa besar di belakang sumbu, bukan detail bulu di awal.",
            "Mahkota tinggi + sayap membuat siluet 'berlian' — cek bounding box lebih lebar di atas.",
            "Kaki tetap menapak; jangan sampai tokoh 'mengambang' tanpa garis tanah.",
        ],
        contour_gatotkaca(),
        {
            "crown": (130, 4),
            "head": (110, 64),
            "eye": (80, 66),
            "nose": (48, 86),
            "chin": (84, 112),
            "shoulder": (96, 138),
            "elbow_f": (40, 172),
            "wrist_f": (12, 152),
            "hip": (104, 230),
            "knee_f": (78, 280),
            "ankle_f": (56, 332),
            "knee_b": (122, 286),
            "ankle_b": (146, 332),
        },
        interior_gagah((80, 66)),
        head_rx=28,
        head_ry=34,
        torso_rx=24,
        torso_ry=48,
    )

    add(
        "hanoman",
        "Hanoman",
        "sedang",
        "wanara",
        "Lembar acuan wanara — moncong kera, telinga menonjol, ekor melingkar, badan kekar tanpa mahkota runcing.",
        [
            "Ganti hidung mancung dengan moncong: oval mendatar di depan muka, bukan duri tajam.",
            "Ekor adalah gestur kedua — S terbalik di belakang pinggul, gambar setelah blocking badan.",
            "Kepala lebih bulat (rx ≈ ry) dibanding satria alus.",
        ],
        contour_hanoman(),
        {
            "crown": (116, 14),
            "head": (100, 56),
            "eye": (76, 56),
            "nose": (36, 92),
            "chin": (78, 114),
            "shoulder": (90, 136),
            "elbow_f": (36, 160),
            "wrist_f": (6, 162),
            "hip": (108, 228),
            "knee_f": (80, 286),
            "ankle_f": (58, 332),
            "knee_b": (128, 288),
            "ankle_b": (152, 332),
        },
        interior_kera((76, 56)),
        head_rx=30,
        head_ry=30,
        torso_rx=26,
        torso_ry=50,
    )

    add(
        "tualen",
        "Tualen",
        "mudah",
        "panasar",
        "Lembar acuan panasar — kepala bulat polos, perut buncit, tubuh pendek, sikap bungkuk komikal.",
        [
            "Proporsi panasar menyimpang dari nawa sanga satria: perut makan unit 4–6 secara berlebihan — itu disengaja.",
            "Tidak ada mahkota; puncak adalah tengkorak bulat. Mulai dari lingkaran kepala besar.",
            "Garis tanah lebih dekat ke pinggul karena kaki pendek.",
        ],
        contour_tualen(),
        {
            "crown": (118, 28),
            "head": (108, 70),
            "eye": (80, 72),
            "nose": (56, 94),
            "chin": (90, 122),
            "shoulder": (96, 148),
            "elbow_f": (48, 168),
            "wrist_f": (24, 170),
            "hip": (128, 248),
            "knee_f": (110, 292),
            "ankle_f": (90, 334),
            "knee_b": (154, 296),
            "ankle_b": (178, 332),
        },
        interior_panasar((80, 72)),
        head_rx=32,
        head_ry=34,
        torso_rx=34,
        torso_ry=48,
    )

    return figures


def main() -> None:
    os.makedirs(ASSETS_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    figures = define_figures()
    public: list[dict[str, Any]] = []
    for fig in figures:
        svg = svg_plate(fig["_contour"], fig["_interior"], fig["_eye"])
        path = os.path.join(ASSETS_DIR, f"{fig['slug']}.svg")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(svg)
        print(f"wrote {path}")
        public.append(
            {k: v for k, v in fig.items() if not k.startswith("_")}
        )

    out_path = os.path.join(DATA_DIR, "silhouettes.json")
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(public, fh, ensure_ascii=False, indent=2)
    print(f"wrote {out_path} ({len(public)} plates)")


if __name__ == "__main__":
    main()
