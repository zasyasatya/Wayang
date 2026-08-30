"""Test endpoint API utama."""
from __future__ import annotations

import base64
import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert "endpoints" in body


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert "Wayang" in res.json()["message"]


def test_list_materials():
    res = client.get("/api/materials")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 10
    assert any(m["slug"] == "wayang-parwa" for m in body["items"])


def test_material_detail():
    res = client.get("/api/materials/detail/wayang-parwa")
    assert res.status_code == 200
    body = res.json()
    assert body["name"] == "Wayang Parwa"
    assert len(body["sources"]) > 0


def test_material_not_found():
    res = client.get("/api/materials/detail/does-not-exist")
    assert res.status_code == 404


def test_list_characters():
    res = client.get("/api/characters")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 15
    assert any(c["slug"] == "arjuna" for c in body["items"])


def test_characters_filter_by_role():
    res = client.get("/api/characters?role=panasar")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 3
    slugs = [c["slug"] for c in body["items"]]
    assert "tualen" in slugs


def test_character_detail():
    res = client.get("/api/characters/arjuna")
    assert res.status_code == 200
    body = res.json()
    assert body["name"].startswith("Arjuna")


def test_character_not_found():
    res = client.get("/api/characters/nonexistent")
    assert res.status_code == 404


def test_history():
    res = client.get("/api/history")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 5
    assert any(h["slug"] == "pengakuan-unesco" for h in body["items"])


def test_history_detail():
    res = client.get("/api/history/asal-usul")
    assert res.status_code == 200
    body = res.json()
    assert len(body["content"]) >= 2


def test_drawing_lessons():
    res = client.get("/api/drawing")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 5


def test_silhouettes():
    res = client.get("/api/silhouettes")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 5


def test_silhouette_image_svg():
    res = client.get("/api/silhouettes/arjuna/image")
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("image/svg+xml")
    assert "svg" in res.text


def _make_png_drawing(color=(0, 0, 0)) -> str:
    """Buat gambar kanvas berisi goresan tinta untuk diuji."""
    img = Image.new("L", (220, 340), 255)
    from PIL import ImageDraw

    draw = ImageDraw.Draw(img)
    draw.rectangle([30, 30, 190, 310], fill=color[0])  # bongkah gelap sebagai 'tinta'
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def test_grade_drawing_returns_score():
    payload = {"image": _make_png_drawing(), "silhouette_id": "arjuna"}
    res = client.post("/api/grade", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert "total_score" in body
    assert "grade" in body
    assert isinstance(body["total_score"], (int, float))


def test_grade_drawing_invalid_image_graceful():
    # Jika gambar tidak dapat didekode, API tetap merespons 200 dengan
    # hasil "tidak dapat dinilai" (graceful), bukan error 500.
    res = client.post("/api/grade", json={"image": "not-base64", "silhouette_id": "arjuna"})
    assert res.status_code == 200
    body = res.json()
    assert body["grade"] == "E"
    assert body["total_score"] == 0


def test_grade_drawing_silhouette_not_found():
    payload = {"image": _make_png_drawing(), "silhouette_id": "nope"}
    res = client.post("/api/grade", json=payload)
    assert res.status_code == 404
