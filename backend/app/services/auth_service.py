"""Layanan autentikasi admin.

Akun dibaca dari ``data/users.json`` bila tersedia (dibuat oleh
``scripts/seed_admin.py``); jika tidak, akun admin bawaan dibentuk dari
environment:

  • ``WAYANG_ADMIN_USERNAME``  (default: ``admin``)
  • ``WAYANG_ADMIN_PASSWORD``  (default: ``wayang2026``)
"""
from __future__ import annotations

import json
import os

from ..security import verify_password

_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
USERS_FILE = os.path.join(_DATA_DIR, "users.json")

DEFAULT_USERNAME = os.getenv("WAYANG_ADMIN_USERNAME", "admin")
DEFAULT_PASSWORD = os.getenv("WAYANG_ADMIN_PASSWORD", "wayang2026")
ADMIN_DISPLAY_NAME = os.getenv("WAYANG_ADMIN_NAME", "Admin Wayang")


def _builtin_admin() -> dict:
    """Akun admin bawaan (tanpa menulis file)."""
    from ..security import hash_password

    return {
        "username": DEFAULT_USERNAME,
        "name": ADMIN_DISPLAY_NAME,
        "role": "admin",
        "password_hash": hash_password(DEFAULT_PASSWORD),
    }


def _load_users() -> list[dict]:
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            users = data.get("users", [])
            if users:
                return users
        except (json.JSONDecodeError, OSError):
            pass  # rusak → pakai akun bawaan
    return [_builtin_admin()]


def authenticate(username: str, password: str) -> dict | None:
    """Kembalikan profil pengguna (tanpa hash) bila kredensial valid."""
    user = next((u for u in _load_users() if u.get("username") == username), None)
    if user is None:
        # Kosongkan waktu kerja agar serangan brute-force tidak lebih cepat.
        verify_password(password, "pbkdf2$120000$00" + "00" * 20 + "$" + "00" * 64)
        return None
    if not verify_password(password, user.get("password_hash", "")):
        return None
    return {
        "username": user["username"],
        "name": user.get("name", user["username"]),
        "role": user.get("role", "admin"),
    }
