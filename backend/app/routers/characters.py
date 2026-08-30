"""Router untuk tokoh-tokoh wayang Bali."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from ..services import store

router = APIRouter(tags=["characters"])


@router.get("/characters")
def list_characters(
    role: Optional[str] = Query(default=None, description="Filter berdasarkan peran (mis. 'satria')."),
    limit: int = Query(default=50, ge=1, le=200),
):
    """Daftar tokoh wayang Bali, opsional difilter berdasarkan peran."""
    items = store.list_characters()
    if role:
        items = [c for c in items if c.get("role") and role in c.get("role", "").lower()]
    return {"items": items[:limit], "total": len(items), "limit": limit}


@router.get("/characters/{slug}")
def character_detail(slug: str):
    """Detail satu tokoh berdasarkan slug."""
    item = store.get_character(slug)
    if not item:
        raise HTTPException(status_code=404, detail=f"Tokoh '{slug}' tidak ditemukan.")
    return item
