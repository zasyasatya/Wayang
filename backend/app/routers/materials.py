"""Router untuk materi pembelajaran (jenis wayang, dsb)."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..services import store

router = APIRouter(tags=["materials"])


@router.get("/materials")
def list_materials():
    """Daftar seluruh materi pembelajaran wayang Bali."""
    return {"items": store.list_materials(), "total": len(store.list_materials())}


@router.get("/materials/{category}")
def materials_by_category(category: str):
    """Daftar materi berdasarkan kategori (mis. 'jenis-wayang')."""
    items = [m for m in store.list_materials() if m.get("category") == category]
    return {"items": items, "total": len(items)}


@router.get("/materials/detail/{slug}")
def material_detail(slug: str):
    """Detail satu materi berdasarkan slug."""
    item = store.get_material(slug)
    if not item:
        raise HTTPException(status_code=404, detail=f"Materi '{slug}' tidak ditemukan.")
    return item
