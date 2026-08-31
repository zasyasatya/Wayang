"""Endpoint autentikasi & profil admin."""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field

from ..schemas import LoginRequest, LoginResponse, UserOut
from ..security import create_token, decode_token
from ..services.auth_service import authenticate

router = APIRouter(tags=["auth"])

_TOKEN_TTL = 8 * 3600  # 8 jam


def _bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, value = authorization.partition(" ")
    if scheme.lower() != "bearer" or not value.strip():
        return None
    return value.strip()


def require_user(authorization: Annotated[str | None, Header()] = None) -> dict:
    """Dependensi: wajib login (role apa pun)."""
    token = _bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Belum masuk. Kirimkan token Bearer.")
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token tidak valid atau kedaluwarsa.")
    return payload


def require_admin(payload: dict = Depends(require_user)) -> dict:
    """Dependensi: khusus role admin."""
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Akses khusus admin.")
    return payload


@router.post("/auth/login", response_model=LoginResponse)
def login(body: LoginRequest):
    """Masuk dengan username & password. Kembalikan token Bearer + profil."""
    user = authenticate(body.username.strip(), body.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Username atau password salah.")
    token = create_token(user["username"], user["role"], ttl=_TOKEN_TTL)
    return LoginResponse(
        token=token,
        token_type="bearer",
        expires_in=_TOKEN_TTL,
        user=UserOut(**user),
    )


@router.get("/auth/me", response_model=UserOut)
def me(payload: dict = Depends(require_user)):
    """Profil pengguna sesuai token (untuk memulihkan sesi di frontend)."""
    from ..services.auth_service import _load_users

    user = next((u for u in _load_users() if u.get("username") == payload.get("sub")), None)
    if user is None:
        raise HTTPException(status_code=401, detail="Akun tidak ditemukan.")
    return UserOut(username=user["username"], name=user.get("name", user["username"]), role=user.get("role", "admin"))


@router.get("/admin/profile")
def admin_profile(payload: dict = Depends(require_admin)):
    """Endpoint terproteksi sebagai contoh penggunaan dependensi admin."""
    from ..services.auth_service import _load_users

    user = next((u for u in _load_users() if u.get("username") == payload.get("sub")), None)
    name = user.get("name", user["username"]) if user else payload.get("sub")
    return {
        "username": payload.get("sub"),
        "name": name,
        "role": "admin",
        "capabilities": ["manage_theme", "manage_content"],
    }
