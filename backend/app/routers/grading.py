"""Router untuk penilaian hasil menggambar siluet."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..schemas import GradingRequest, GradingResponse
from ..services import store
from ..services.grading_service import grade_drawing

router = APIRouter(tags=["grading"])


@router.post("/grade", response_model=GradingResponse)
def grade(request: GradingRequest):
    """Menilai gambar pengguna terhadap satu siluet referensi."""
    silhouette = store.get_silhouette(request.silhouette_id)
    if not silhouette:
        raise HTTPException(
            status_code=404,
            detail=f"Siluet '{request.silhouette_id}' tidak ditemukan.",
        )

    result = grade_drawing(
        request.image,
        silhouette.get("ref_points", []),
        reference_difficulty=silhouette.get("difficulty", "sedang"),
    )

    return {
        "silhouette_id": silhouette["id"],
        "silhouette_name": silhouette["name"],
        "total_score": result["total_score"],
        "grade": result["grade"],
        "grade_label": result["grade_label"],
        "feedback": result["feedback"],
        "dimensions": result["dimensions"],
        "metrics": result["metrics"],
    }
