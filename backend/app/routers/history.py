"""Router untuk materi sejarah wayang Bali."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..services import store

router = APIRouter(tags=["history"])


@router.get("/history")
def list_history():
    """Daftar modul/artikel sejarah wayang Bali."""
    return {"items": store.list_histories(), "total": len(store.list_histories())}


@router.get("/history/{slug}")
def history_detail(slug: str):
    """Detail satu bagian sejarah berdasarkan slug."""
    item = next((h for h in store.list_histories() if h.get("slug") == slug), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"Bagian sejarah '{slug}' tidak ditemukan.")
    return item
