"""Router untuk siluet referensi latihan menggambar."""
from __future__ import annotations

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..config import settings
from ..services import store

router = APIRouter(tags=["silhouettes"])


@router.get("/silhouettes")
def list_silhouettes():
    """Daftar siluet tersedia untuk latihan menggambar."""
    items = store.list_silhouettes()
    return {"items": items, "total": len(items)}


@router.get("/silhouettes/{silhouette_id}/image")
def silhouette_image(silhouette_id: str):
    """Mengembalikan gambar SVG siluet untuk ditampilkan di kanvas."""
    item = store.get_silhouette(silhouette_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Siluet '{silhouette_id}' tidak ditemukan.")
    slug = item.get("slug") or silhouette_id
    path = os.path.join(settings.ASSETS_DIR, "silhouettes", f"{slug}.svg")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File siluet tidak ditemukan.")
    return FileResponse(path, media_type="image/svg+xml")
