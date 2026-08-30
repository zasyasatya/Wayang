"""Unit test untuk mesin penilaian menggambar."""
from __future__ import annotations

import base64
import io

import numpy as np
from PIL import Image

from app.services.grading_service import (
    _ink_mask,
    _normalize_and_center,
    _normalize_ref_points,
    grade_drawing,
)


def _data_url_from_array(arr: np.ndarray) -> str:
    img = Image.fromarray(arr.astype(np.uint8))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def _square_points() -> list[list[int]]:
    return [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]


def test_ink_mask_empty():
    arr = np.full((50, 50), 255, dtype=np.float32)
    mask = _ink_mask(arr)
    assert mask.sum() == 0


def test_ink_mask_dark():
    arr = np.full((50, 50), 10, dtype=np.float32)
    mask = _ink_mask(arr)
    assert mask.sum() == 50 * 50


def test_normalize_and_center():
    mask = np.zeros((100, 100), dtype=bool)
    mask[40:60, 40:60] = True
    out = _normalize_and_center(mask, canvas=200)
    assert out.shape == (200, 200)
    assert out.sum() > 0
    ys, xs = np.where(out)
    # harus terpusat
    assert abs(xs.mean() - 100) < 10
    assert abs(ys.mean() - 100) < 10


def test_normalize_ref_points():
    pts = _square_points()
    out = _normalize_ref_points(pts, canvas=200)
    assert out.shape == (5, 2)
    assert out[:, 0].min() >= 0
    assert out[:, 0].max() <= 200
    assert out[:, 1].min() >= 0
    assert out[:, 1].max() <= 200


def test_grade_drawing_valid():
    # Gambar yang menyerupai titik-titik ref (square outline) dalam bentuk tinta.
    arr = np.full((200, 200), 255, dtype=np.float32)
    arr[20:180, 20] = 0
    arr[20:180, 180] = 0
    arr[20, 20:180] = 0
    arr[180, 20:180] = 0
    img_url = _data_url_from_array(arr)

    ref = [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]
    # pastikan gambar bukan bodoh: skala ref sama seperti gambar.
    result = grade_drawing(img_url, ref, reference_difficulty="mudah")
    assert result["valid"] is True
    assert "total_score" in result
    assert "grade" in result
    assert result["total_score"] > 0


def test_grade_drawing_empty():
    arr = np.full((200, 200), 255, dtype=np.float32)
    img_url = _data_url_from_array(arr)
    result = grade_drawing(img_url, _square_points())
    assert result["valid"] is False
    assert result["grade"] == "E"


def test_grade_drawing_invalid_base64():
    result = grade_drawing("i-am-not-base64", _square_points())
    assert result["valid"] is False
    assert "error" in result
