"""Aplikasi FastAPI untuk platform pembelajaran wayang Bali."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .routers import auth, characters, drawing, grading, history, materials, silhouettes

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "API untuk platform pembelajaran wayang Bali: jenis wayang, tokoh, "
        "sejarah, menggambar pola, serta penilaian siluet."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route prefix
_api = settings.API_PREFIX

# Aset statis (siluet SVG) disajikan melalui route khusus, tetapi juga diekspos.
app.mount("/static", StaticFiles(directory=settings.ASSETS_DIR), name="static")

app.include_router(materials.router, prefix=_api)
app.include_router(characters.router, prefix=_api)
app.include_router(history.router, prefix=_api)
app.include_router(drawing.router, prefix=_api)
app.include_router(silhouettes.router, prefix=_api)
app.include_router(grading.router, prefix=_api)
app.include_router(auth.router, prefix=_api)


@app.get("/api/health", tags=["health"])
def health():
    """Menunjukkan bahwa server berjalan dan konfigurasi OK."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "endpoints": {
            "health": "/api/health",
            "docs": "/api/docs",
            "materials": "/api/materials",
            "characters": "/api/characters",
            "history": "/api/history",
            "drawing": "/api/drawing",
            "silhouettes": "/api/silhouettes",
            "grading": "/api/grade",
            "auth_login": "/api/auth/login",
            "auth_me": "/api/auth/me",
            "admin_profile": "/api/admin/profile",
        },
    }


@app.get("/", tags=["root"])
def root():
    """Informasi ringkas layanan."""
    return {
        "message": "Selamat datang di Wayang Bali Learning Platform API ✦",
        "docs": "/api/docs",
        "health": "/api/health",
    }
