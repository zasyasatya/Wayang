"""Utilitas keamanan ringan tanpa dependensi eksternal.

Berisi:
  • Hash password PBKDF2-HMAC-SHA256 (salt acak per akun).
  • Token sesi berbasis HMAC-SHA256 (stateless, tanpa JWT library).
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import time

_PBKDF2_ITER = 120_000


def _secret() -> str:
    """Secret penanda tangan token. Override via env WAYANG_AUTH_SECRET."""
    return os.getenv("WAYANG_AUTH_SECRET", "wayang-bali-dev-secret-ganti-di-production")


# ---------------------------------------------------------------------------
# Hash password
# ---------------------------------------------------------------------------
def hash_password(password: str, salt: bytes | None = None) -> str:
    """Hasil disimpan sebagai ``pbkdf2$<iter>$<salt-hex>$<hash-hex>``."""
    if salt is None:
        salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _PBKDF2_ITER)
    return f"pbkdf2${_PBKDF2_ITER}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    """Verifikasi dengan perbandingan waktu-konstan (constant-time)."""
    try:
        scheme, it, salt_hex, digest_hex = stored.split("$")
        if scheme != "pbkdf2":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(it)
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, AttributeError):
        return False


# ---------------------------------------------------------------------------
# Token sesi (HMAC-SHA256, format body.signature, base64url)
# ---------------------------------------------------------------------------
def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _b64url_decode(raw: str) -> bytes:
    pad = "=" * (-len(raw) % 4)
    return base64.urlsafe_b64decode(raw + pad)


def create_token(subject: str, role: str, ttl: int = 8 * 3600) -> str:
    """Buat token bertanda tangan. ``ttl`` dalam detik (<= 0 untuk token kedaluwarsa)."""
    now = int(time.time())
    payload = {"sub": subject, "role": role, "iat": now, "exp": now + ttl}
    body = _b64url_encode(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8"))
    sig = _b64url_encode(hmac.new(_secret().encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest())
    return f"{body}.{sig}"


def decode_token(token: str) -> dict | None:
    """Verifikasi tanda tangan & masa berlaku. Kembalikan payload atau ``None``."""
    try:
        body, sig = token.split(".")
    except (ValueError, AttributeError):
        return None
    expected = _b64url_encode(
        hmac.new(_secret().encode("utf-8"), body.encode("ascii"), hashlib.sha256).digest()
    )
    if not hmac.compare_digest(sig, expected):
        return None
    try:
        payload = json.loads(_b64url_decode(body))
    except (ValueError, TypeError):
        return None
    if not isinstance(payload, dict) or payload.get("exp", 0) < time.time():
        return None
    return payload
