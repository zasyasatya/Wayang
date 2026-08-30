"""Router untuk pelajaran menggambar pola wayang Bali."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..services import store

router = APIRouter(tags=["drawing"])


@router.get("/drawing")
def list_lessons():
    """Daftar pelajaran menggambar pola wayang."""
    return {"items": store.list_drawing_lessons(), "total": len(store.list_drawing_lessons())}


@router.get("/drawing/{slug}")
def lesson_detail(slug: str):
    """Detail satu pelajaran menggambar berdasarkan slug."""
    item = next((l for l in store.list_drawing_lessons() if l.get("slug") == slug), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"Pelajaran '{slug}' tidak ditemukan.")
    return item
