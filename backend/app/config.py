"""Konfigurasi lingkungan untuk backend.

Semua nilai dapat dioverride melalui environment variable (prefix ``WAYANG_``).
"""
from __future__ import annotations

import os
from functools import lru_cache


def _bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    """Pengaturan aplikasi yang dibaca dari environment."""

    PROJECT_NAME: str = "Wayang Bali Learning Platform API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Origin frontend yang diizinkan memanggil API (CORS).
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("WAYANG_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
        if origin.strip()
    ]

    # Direktori data materi (JSON) dan aset siluet.
    DATA_DIR: str = os.getenv(
        "WAYANG_DATA_DIR",
        os.path.join(os.path.dirname(__file__), "data"),
    )
    ASSETS_DIR: str = os.getenv(
        "WAYANG_ASSETS_DIR",
        os.path.join(os.path.dirname(__file__), "assets"),
    )

    # Ambang penilaian menggambar (0..1 / piksel).
    GRADING_TOLERANCE_RATIO: float = float(os.getenv("WAYANG_GRADING_TOLERANCE", "0.03"))
    GRADING_MERIT_WEIGHT: float = float(os.getenv("WAYANG_MERIT_WEIGHT", "0.55"))
    GRADING_COVERAGE_WEIGHT: float = float(os.getenv("WAYANG_COVERAGE_WEIGHT", "0.45"))

    # Ukuran kanvas normalisasi untuk penilaian.
    GRADING_CANVAS_SIZE: int = int(os.getenv("WAYANG_GRADING_CANVAS", "512"))

    @property
    def cors_origins(self) -> list[str]:
        return self.CORS_ORIGINS

    @property
    def grading_tolerance(self) -> float:
        return self.GRADING_TOLERANCE_RATIO

    @property
    def grading_canvas_size(self) -> int:
        return self.GRADING_CANVAS_SIZE


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
