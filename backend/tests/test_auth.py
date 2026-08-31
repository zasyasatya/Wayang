"""Test autentikasi admin (login, token, proteksi endpoint)."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.security import create_token, hash_password, verify_password
from app.services.auth_service import DEFAULT_PASSWORD, DEFAULT_USERNAME

client = TestClient(app)


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _login(username: str = DEFAULT_USERNAME, password: str = DEFAULT_PASSWORD) -> dict:
    res = client.post("/api/auth/login", json={"username": username, "password": password})
    assert res.status_code == 200
    return res.json()


# ---------------------------------------------------------------------------
# Hash password
# ---------------------------------------------------------------------------
def test_password_hash_roundtrip():
    stored = hash_password("rahasia-123")
    assert stored.startswith("pbkdf2$")
    assert verify_password("rahasia-123", stored) is True
    assert verify_password("rahasia-124", stored) is False


def test_verify_password_garbage():
    assert verify_password("apa", "bukan-format") is False
    assert verify_password("apa", "") is False


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
def test_login_success_returns_token_and_profile():
    body = _login()
    assert body["token_type"] == "bearer"
    assert body["expires_in"] > 0
    assert body["token"]
    assert body["user"]["username"] == DEFAULT_USERNAME
    assert body["user"]["role"] == "admin"
    assert "password" not in str(body).lower()  # jangan pernah bocorkan kredensial


def test_login_wrong_password():
    res = client.post(
        "/api/auth/login", json={"username": DEFAULT_USERNAME, "password": "salah-banget"}
    )
    assert res.status_code == 401


def test_login_unknown_user():
    res = client.post("/api/auth/login", json={"username": "seseorang", "password": DEFAULT_PASSWORD})
    assert res.status_code == 401


def test_login_empty_username_rejected():
    res = client.post("/api/auth/login", json={"username": "", "password": "x"})
    assert res.status_code == 422


# ---------------------------------------------------------------------------
# /api/auth/me
# ---------------------------------------------------------------------------
def test_me_with_valid_token():
    body = _login()
    res = client.get("/api/auth/me", headers=_headers(body["token"]))
    assert res.status_code == 200
    assert res.json()["username"] == DEFAULT_USERNAME
    assert res.json()["role"] == "admin"


def test_me_without_token():
    assert client.get("/api/auth/me").status_code == 401


def test_me_with_garbage_token():
    assert client.get("/api/auth/me", headers=_headers("abc.def")).status_code == 401


def test_me_with_tampered_token():
    body = _login()
    tampered = body["token"][:-4] + ("AAAA" if not body["token"].endswith("AAAA") else "BBBB")
    assert client.get("/api/auth/me", headers=_headers(tampered)).status_code == 401


def test_me_with_expired_token():
    expired = create_token(DEFAULT_USERNAME, "admin", ttl=-10)
    assert client.get("/api/auth/me", headers=_headers(expired)).status_code == 401


# ---------------------------------------------------------------------------
# /api/admin/profile (khusus admin)
# ---------------------------------------------------------------------------
def test_admin_profile_requires_token():
    assert client.get("/api/admin/profile").status_code == 401


def test_admin_profile_with_token():
    body = _login()
    res = client.get("/api/admin/profile", headers=_headers(body["token"]))
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "admin"
    assert data["username"] == DEFAULT_USERNAME
    assert "manage_theme" in data["capabilities"]


def test_health_lists_auth_endpoints():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["endpoints"]["auth_login"] == "/api/auth/login"


@pytest.mark.parametrize("bad", [None, "Bearer", "Basic abc", "Bearer   "])
def test_bad_authorization_headers(bad):
    headers = {} if bad is None else {"Authorization": bad}
    assert client.get("/api/auth/me", headers=headers).status_code == 401
