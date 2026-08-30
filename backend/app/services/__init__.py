"""Service untuk memuat & menyimpan data materi dari file JSON."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..config import settings


class DataStore:
    """Memuat seluruh materi wayang Bali dari direktori ``data``."""

    def __init__(self, data_dir: str | Path | None = None) -> None:
        self._data_dir = Path(data_dir or settings.DATA_DIR)
        self._cache: dict[str, Any] = {}

    def _load(self, name: str) -> Any:
        file_path = self._data_dir / f"{name}.json"
        if not file_path.exists():
            raise FileNotFoundError(f"Data file not found: {file_path}")
        if name not in self._cache:
            with file_path.open(encoding="utf-8") as fh:
                self._cache[name] = json.load(fh)
        return self._cache[name]

    def list_materials(self) -> list[dict[str, Any]]:
        return self._load("materials")

    def get_material(self, slug: str) -> dict[str, Any] | None:
        return next((m for m in self.list_materials() if m.get("slug") == slug), None)

    def list_characters(self) -> list[dict[str, Any]]:
        return self._load("characters")

    def get_character(self, slug: str) -> dict[str, Any] | None:
        return next((c for c in self.list_characters() if c.get("slug") == slug), None)

    def list_histories(self) -> list[dict[str, Any]]:
        return self._load("history")

    def list_drawing_lessons(self) -> list[dict[str, Any]]:
        return self._load("drawing_lessons")

    def list_silhouettes(self) -> list[dict[str, Any]]:
        return self._load("silhouettes")

    def get_silhouette(self, silhouette_id: str) -> dict[str, Any] | None:
        return next(
            (s for s in self.list_silhouettes() if s.get("id") == silhouette_id),
            None,
        )


store = DataStore()
