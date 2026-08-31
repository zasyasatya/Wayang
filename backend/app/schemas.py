"""Skema (model) request/response untuk API wayang Bali."""
from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class MaterialItem(BaseModel):
    """Satu entitas materi pembelajaran."""

    id: str
    slug: str
    name: str
    category: str
    summary: str
    description: str
    key_points: list[str] = Field(default_factory=list)
    details: dict[str, Any] = Field(default_factory=dict)
    sources: list[dict[str, str]] = Field(default_factory=list)
    images: list[dict[str, str]] = Field(default_factory=list)


class Character(BaseModel):
    id: str
    slug: str
    name: str
    wikipedia_name: str | None = None
    role: str
    wanda: str | None = None
    type: str | None = None
    summary: str
    description: str
    traits: list[str] = Field(default_factory=list)
    origin: dict[str, str] = Field(default_factory=dict)
    related_stories: list[str] = Field(default_factory=list)
    sources: list[dict[str, str]] = Field(default_factory=list)


class Silhouette(BaseModel):
    """Referensi siluet untuk latihan menggambar."""

    id: str
    name: str
    character_id: str
    difficulty: str
    description: str
    tips: list[str] = Field(default_factory=list)
    ref_points: list[list[int]] = Field(default_factory=list)


class GradingRequest(BaseModel):
    """Permintaan penilaian hasil menggambar.

    ``image`` adalah data-URL/Base64 (PNG) dari kanvas gambar pengguna.
    ``silhouette_id`` merujuk ke referensi yang dipilih.
    """

    image: str = Field(..., description="Data-URL gambar (base64 PNG) hasil menggambar pengguna.")
    silhouette_id: str = Field(..., description="ID siluet referensi yang ditiru.")
    opacity: float = Field(default=1.0, ge=0.0, le=1.0, description="Opasitas goresan (untuk info).")


class GradingDimension(BaseModel):
    """Hasil satu dimensi penilaian."""

    name: str
    score: float
    percentage: float
    label: str
    note: str


class GradingResponse(BaseModel):
    """Hasil penilaian keseluruhan."""

    silhouette_id: str
    silhouette_name: str
    total_score: float
    grade: str
    grade_label: str
    feedback: list[str]
    dimensions: list[GradingDimension]
    metrics: dict[str, float]


class PaginatedResponse(BaseModel):
    items: list[Any]
    total: int
    offset: int = 0
    limit: int = 50


# ---------------------------------------------------------------------------
# Autentikasi
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    """Permintaan masuk (login) admin."""

    username: str = Field(min_length=1, max_length=64, description="Username admin.")
    password: str = Field(min_length=1, max_length=128, description="Password admin.")


class UserOut(BaseModel):
    """Profil pengguna (tanpa data sensitif)."""

    username: str
    name: str
    role: str


class LoginResponse(BaseModel):
    """Hasil login: token Bearer + profil pengguna."""

    token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut
