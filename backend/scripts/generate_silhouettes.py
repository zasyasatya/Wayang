"""Menghasilkan SVG siluet dan data ref_points untuk platform pembelajaran.

Berjalan sekali:  python scripts/generate_silhouettes.py

Setiap siluet dibangun dari poligon yang sama sehingga file SVG dan `ref_points`
(untuk penilaian otomatis) selalu konsisten.
"""
from __future__ import annotations

import json
import os
from typing import List, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(HERE, "..", "app", "data"))
ASSETS_DIR = os.path.abspath(os.path.join(HERE, "..", "app", "assets", "silhouettes"))

Point = Tuple[int, int]
W = 220
H = 340
MAX_X, MAX_Y = W, H


def _to_path(points: List[Point]) -> str:
    first = True
    parts: List[str] = []
    for x, y in points:
        parts.append(f"{'M' if first else 'L'}{x},{y}")
        first = False
    parts.append("Z")
    return " ".join(parts)


def svg_shield(points: List[Point], color: str = "#2B1B12") -> str:
    body = _to_path(points)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        'width="440" height="640" role="img" aria-label="siluet wayang">'
        '<rect width="{W}" height="{H}" fill="#FBF4E8"/>'
        f'<path d="{body}" fill="{color}" stroke="#513425" stroke-width="2" stroke-linejoin="round"/>'
        '</svg>'
    ).format(W=W, H=H)


# ---------------------------------------------------------------------------
# Definisi siluet (poligon tertutup, koordinat 0..W x 0..H)
# ---------------------------------------------------------------------------

def _humanoid(
    crown_height: int,
    crown_width: int,
    head_r: int,
    neck_w: int,
    shoulder_w: int,
    belly: int,
    cape: bool,
    hand_size: int,
    leg_spread: int,
    crown_type: str = "cone",
) -> List[Point]:
    """Poligon siluet manusia berdiri (menghadap depan) yang dapat diparameterisasi.

    Koordinat mengikuti sistem 0..W x 0..H. Siluet dikelilingi searah jarum jam
    dimulai dari puncak mahkota.
    """
    cx = W / 2
    top = 10 + crown_height
    crown_l = int(cx - crown_width / 2)
    crown_r = int(cx + crown_width / 2)

    # Level vertikal utama
    y_crown = top
    y_shoulders = top + crown_height + head_r + 14
    y_hands = y_shoulders + 46
    y_hips = y_shoulders + 96
    y_feet = H - 6

    # Siluet kiri (dari sisi penonton): jalur belakang/kiri
    def left_side(pts: List[Point]) -> None:
        pts.append((crown_l, y_crown))
        pts.append((int(cx - head_r - 4), y_crown + 6))          # kepala atas kiri
        pts.append((int(cx - head_r - 8), y_crown + head_r))     # kepala kiri
        pts.append((int(cx - head_r + 4), y_crown + head_r * 2 - 2))  # dagu kiri
        pts.append((int(cx - neck_w), y_shoulders - 4))          # leher kiri (cekung)
        pts.append((int(cx - shoulder_w), y_shoulders))          # bahu kiri
        pts.append((int(cx - shoulder_w - hand_size // 2), y_shoulders + 18))  # lengan atas luar
        pts.append((int(cx - shoulder_w - hand_size), y_hands))  # tangan kiri (menjulur)
        pts.append((int(cx - shoulder_w - hand_size + 12), y_hands + 6))       # ujung tangan
        pts.append((int(cx - shoulder_w + 4), y_hands - 6))      # ketiak kiri (cekung)
        pts.append((int(cx - belly), y_hips - 14))               # perut kiri
        pts.append((int(cx - belly + 4), y_hips))                # pinggul kiri
        pts.append((int(cx - leg_spread - 2), y_hips + 18))      # paha luar kiri
        pts.append((int(cx - leg_spread - 10), y_hips + 52))     # lutut kiri
        pts.append((int(cx - leg_spread - 6), y_feet - 6))       # tungkai bawah kiri
        pts.append((int(cx - leg_spread - 22), y_feet))          # kaki kiri luar
        pts.append((int(cx + leg_spread - 8), y_feet))           # kaki kiri dalam

    # Siluet kanan: cermin dari jalur kiri dengan sedikit asimetri
    def right_side(pts: List[Point]) -> None:
        pts.append((int(cx + leg_spread + 14), y_feet))          # kaki kanan luar
        pts.append((int(cx + leg_spread + 6), y_feet - 6))       # tungkai bawah kanan
        pts.append((int(cx + leg_spread + 2), y_hips + 52))      # lutut kanan
        pts.append((int(cx + leg_spread - 2), y_hips + 18))      # paha luar kanan
        pts.append((int(cx + belly - 4), y_hips))                # pinggul kanan
        pts.append((int(cx + belly), y_hips - 14))               # perut kanan
        pts.append((int(cx + shoulder_w - 4), y_hands - 6))      # ketiak kanan
        pts.append((int(cx + shoulder_w + hand_size - 12), y_hands + 6))
        pts.append((int(cx + shoulder_w + hand_size), y_hands))  # tangan kanan
        pts.append((int(cx + shoulder_w + hand_size // 2), y_shoulders + 18))
        pts.append((int(cx + shoulder_w), y_shoulders))          # bahu kanan
        pts.append((int(cx + neck_w), y_shoulders - 4))          # leher kanan
        pts.append((int(cx + head_r - 4), y_crown + head_r * 2 - 2))  # dagu kanan
        pts.append((int(cx + head_r + 8), y_crown + head_r))     # kepala kanan
        pts.append((int(cx + head_r + 4), y_crown + 6))          # kepala atas kanan
        pts.append((crown_r, y_crown))

    pts: List[Point] = []
    # Mahkota
    if crown_type == "cone":
        pts.append((int(cx), 6))          # puncak mahkota meruncing
    else:
        pts.append((int(cx - crown_width // 3), 12))
        pts.append((int(cx), 8))
        pts.append((int(cx + crown_width // 3), 12))

    left_side(pts)
    right_side(pts)
    return pts


# Tokoh: (slug, name, character_id, difficulty, desc, tips, pts)
def define_silhouettes() -> List[dict]:
    arjuna = _humanoid(
        crown_height=28, crown_width=44, head_r=26, neck_w=16, shoulder_w=28,
        belly=30, cape=True, hand_size=24, leg_spread=40, crown_type="cone",
    )
    bima = _humanoid(
        crown_height=18, crown_width=30, head_r=30, neck_w=20, shoulder_w=44,
        belly=46, cape=False, hand_size=30, leg_spread=46, crown_type="rounded",
    )
    gatotkaca = _humanoid(
        crown_height=44, crown_width=34, head_r=26, neck_w=18, shoulder_w=38,
        belly=40, cape=True, hand_size=28, leg_spread=44, crown_type="cone",
    )
    hanoman = _humanoid(
        crown_height=24, crown_width=20, head_r=30, neck_w=16, shoulder_w=40,
        belly=34, cape=False, hand_size=30, leg_spread=40, crown_type="rounded",
    )
    rama = _humanoid(
        crown_height=34, crown_width=48, head_r=24, neck_w=15, shoulder_w=26,
        belly=26, cape=True, hand_size=22, leg_spread=36, crown_type="cone",
    )
    tualen = _humanoid(
        crown_height=10, crown_width=14, head_r=24, neck_w=18, shoulder_w=34,
        belly=42, cape=False, hand_size=26, leg_spread=34, crown_type="rounded",
    )

    def record(slug, name, character_id, difficulty, desc, tips, pts):
        return {
            "id": slug,
            "slug": slug,
            "name": name,
            "character_id": character_id,
            "difficulty": difficulty,
            "description": desc,
            "tips": tips,
            "ref_points": [list(p) for p in pts],
        }

    return [
        record(
            "arjuna", "Arjuna", "arjuna", "mudah",
            "Siluet kesatria halus (wanda alus) dengan mahkota meruncing dan pose luwes.",
            ["Imgur dari garis sumbu lalu ikuti kontur luar.", "Perhatikan mahkota yang menjulang.", "Gambar dari kepala turun ke kaki."],
            arjuna,
        ),
        record(
            "bima", "Bima", "bima", "sedang",
            "Siluet kesatria gagah dengan tubuh besar, bahu lebar, dan tanpa jubah.",
            ["Bahu lebih lebar dari tokoh halus.", "Badan diisi penuh agar terlihat gagah.", "Posisi kaki terangkat khas wayang."],
            bima,
        ),
        record(
            "gatotkaca", "Gatotkaca", "gatotkaca", "sedang",
            "Siluet kesatria bersayap dengan mahkota tinggi dan tubuh kuat.",
            ["Perhatikan tinggi mahkota.", "Garis bahu dan lengan luwes.", "Ikuti kelengkungan jubah di belakang."],
            gatotkaca,
        ),
        record(
            "hanoman", "Hanoman", "hanoman", "sedang",
            "Siluet kesatria kera yang gagah dengan wajah dan telinga khas.",
            ["Kepala sedikit membesar (kera).", "Badan kekar tanpa jubah.", "Posisi tangan melangkah/bersemedi."],
            hanoman,
        ),
        record(
            "rama", "Rama", "rama", "mudah",
            "Siluet tokoh utama Ramayana dengan mahkota tinggi dan badan ramping.",
            ["Mahkota tinggi khas raja.", "Badannya ramping dan halus.", "Jubah menambah kesan agung."],
            rama,
        ),
        record(
            "tualen", "Tualen", "tualen", "mudah",
            "Siluet panasar (punakawan) dengan badan bulat, perut buncit, dan kepala tanpa mahkota besar.",
            ["Perut buncit khas pelawak.", "Kepala polos tanpa mahkota.", "Badan gemuk dan pendek."],
            tualen,
        ),
    ]


def main() -> None:
    os.makedirs(ASSETS_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    records = define_silhouettes()
    for rec in records:
        pts = [tuple(p) for p in rec["ref_points"]]
        svg = svg_shield(pts)
        path = os.path.join(ASSETS_DIR, f"{rec['slug']}.svg")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(svg)
        print(f"wrote {path}")

    out_path = os.path.join(DATA_DIR, "silhouettes.json")
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(records, fh, ensure_ascii=False, indent=2)
    print(f"wrote {out_path} ({len(records)} silhouettes)")


if __name__ == "__main__":
    main()
