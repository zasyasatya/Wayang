#!/usr/bin/env python3
"""
run.py — Menjalankan backend (FastAPI) dan frontend (Next.js) sekaligus.

Fitur:
  • Pengecekan environment (Python, Node, npm, dan versi minimum).
  • Instalasi otomatis dependensi backend (pip) & frontend (npm) bila belum ada.
  • Menjalankan uvicorn (backend) dan next dev (frontend) secara paralel.
  • Shutdown bersih saat dihentikan (Ctrl+C).

Cara pakai:
    python3 run.py
    python3 run.py --skip-install        # lewati pemeriksaan & instalasi package
    python3 run.py --no-frontend / --no-backend
    python3 run.py --host 0.0.0.0 --backend-port 8000 --frontend-port 3000

Kebutuhan:
    • Python >= 3.10  (termasuk python3-venv dan apt akses bila pakai venv)
    • Node.js >= 18, npm >= 9
"""
from __future__ import annotations

import argparse
import os
import shutil
import signal
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
VENV_DIR = ROOT / ".venv"

BACKEND_REQ = BACKEND_DIR / "requirements.txt"
FRONTEND_REQ = FRONTEND_DIR / "package.json"

# Nama file marker untuk mencegah instalasi berulang (sederhana & cepat).
BACKEND_MARKER = BACKEND_DIR / ".installed"
FRONTEND_MARKER = FRONTEND_DIR / "node_modules"

MIN_PY = (3, 10)
MIN_NODE = (18, 0)
MIN_NPM = (9, 0)


# ---------------------------------------------------------------------------
# Util
# ---------------------------------------------------------------------------
def info(msg: str) -> None:
    print(f"[run.py] {msg}")


def warn(msg: str) -> None:
    print(f"[run.py] ! {msg}", file=sys.stderr)


def die(msg: str) -> None:
    print(f"[run.py] !! {msg}", file=sys.stderr)
    sys.exit(1)


def _version_tuple(cmd_parts: list[str]) -> tuple[int, ...]:
    try:
        out = subprocess.check_output(cmd_parts, text=True).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return ()
    # Ambil urutan angka pertama pada output.
    import re

    match = re.search(r"(\d+(?:\.\d+)*)", out)
    if not match:
        return ()
    return tuple(int(x) for x in match.group(1).split("."))


def check_tool(name: str, min_ver: tuple[int, ...]) -> tuple[bool, str]:
    if name == "python":
        v = _version_tuple([sys.executable, "--version"])
        path = sys.executable
    else:
        path = shutil.which(name)
        if path is None:
            return False, f"{name} tidak ditemukan di PATH"
        v = _version_tuple([path, "--version"])

    if not v:
        return False, f"Tidak dapat membaca versi {name}"
    if v[: len(min_ver)] < min_ver:
        return False, f"{name} {'.'.join(map(str, v))} terlalu lama (min {'.'.join(map(str, min_ver))})"
    return True, f"{name} {'.'.join(map(str, v))} @ {path}"


# ---------------------------------------------------------------------------
# Pemeriksaan & instalasi
# ---------------------------------------------------------------------------
def find_venv_python() -> str | None:
    """Kembalikan path interpreter venv bila ada, selain itu None."""
    if not VENV_DIR.exists():
        return None
    venv_python = VENV_DIR / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if venv_python.exists():
        return str(venv_python)
    return None


def ensure_python_env() -> str:
    """Pastikan venv ada + dependensi backend terpasang. Kembalikan interpreter path.

    Selalu utamakan venv bila ada, bahkan saat --skip-install, agar modul
    (uvicorn, numpy, dst) yang telah terpasang dipakai.
    """
    python = find_venv_python() or sys.executable
    if find_venv_python():
        info(f"Menggunakan venv: {Path(python).parent}")

    marker_updated = False
    if not BACKEND_MARKER.exists() or _installed_outdated(BACKEND_MARKER, BACKEND_REQ):
        info("Memeriksa dependensi backend (requirements.txt)…")
        pip_cmd = [python, "-m", "pip", "install", "--upgrade", "-r", str(BACKEND_REQ)]
        _run(pip_cmd, cwd=BACKEND_DIR, label="instal backend")
        BACKEND_MARKER.write_text("installed\n", encoding="utf-8")
        marker_updated = True
    else:
        info("Dependensi backend sudah terpasang (pakai --reinstall untuk memaksa).")

    return python


def _installed_outdated(marker: Path, req: Path) -> bool:
    try:
        marker_mtime = marker.stat().st_mtime
        req_mtime = req.stat().st_mtime
        return req_mtime > marker_mtime
    except FileNotFoundError:
        return True


def ensure_frontend() -> str:
    """Pastikan npm install sudah dijalankan. Kembalikan npm path."""
    if not SHUTDOWN_FLAGS["no_install"]:
        if os.environ.get("SKIP_INSTALL") == "1":
            info("Melewati instalasi frontend (SKIP_INSTALL=1).")
            return shutil.which("npm") or "npm"

    npm = shutil.which("npm")
    if npm is None:
        die("npm tidak ditemukan. Install Node.js terlebih dahulu.")

    if FRONTEND_REQ.exists() and not FRONTEND_MARKER.exists():
        info("Memeriksa dependensi frontend (npm install)…")
        _run([npm, "install"], cwd=FRONTEND_DIR, label="instal frontend")
    else:
        info("Dependensi frontend sudah terpasang (node_modules ada).")
    return npm


SHUTDOWN_FLAGS: dict = {"no_install": False, "reinstall": False}


# ---------------------------------------------------------------------------
# Menjalankan proses
# ---------------------------------------------------------------------------
def _run(cmd: list[str], cwd: Path, label: str) -> None:
    info(f"→ {label}: {' '.join(cmd)}")
    ret = subprocess.run(cmd, cwd=cwd)
    if ret.returncode != 0:
        die(f"{label} gagal dengan kode {ret.returncode}.\nCek output di atas.")


def _spawn_logged(cmd: list[str], cwd: Path, log_file: Path) -> subprocess.Popen:
    info(f"Menjalankan: {' '.join(cmd)} (log → {log_file})")
    logf = open(log_file, "w", encoding="utf-8")
    return subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=logf,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        preexec_fn=os.setsid if os.name != "nt" else None,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Jalankan Wayang Bali (backend + frontend).")
    parser.add_argument("--host", default="0.0.0.0", help="Host ikat untuk server (default 0.0.0.0).")
    parser.add_argument("--backend-port", type=int, default=8000)
    parser.add_argument("--frontend-port", type=int, default=3000)
    parser.add_argument("--skip-install", action="store_true", help="Abaikan pemeriksaan/instalasi package.")
    parser.add_argument("--reinstall", action="store_true", help="Paksa instal ulang dependensi.")
    parser.add_argument("--no-backend", action="store_true", help="Hanya jalankan frontend.")
    parser.add_argument("--no-frontend", action="store_true", help="Hanya jalankan backend.")
    args = parser.parse_args()

    SHUTDOWN_FLAGS["no_install"] = args.skip_install
    SHUTDOWN_FLAGS["reinstall"] = args.reinstall

    if args.skip_install:
        os.environ["SKIP_INSTALL"] = "1"

    # 1) Pemeriksaan environment
    ok, msg = check_tool("python", MIN_PY)
    warn(msg) if not ok else info(msg)
    if not ok:
        die("Python tidak memenuhi syarat.")

    ok, msg = check_tool("node", MIN_NODE)
    warn(msg) if not ok else info(msg)
    if not ok:
        die("Node.js tidak memenuhi syarat.")

    ok, msg = check_tool("npm", MIN_NPM)
    warn(msg) if not ok else info(msg)
    if not ok:
        die("npm tidak memenuhi syarat.")

    # 2) Instalasi dependensi (kecuali --skip-install)
    # Selalu utamakan venv bila ada agar modul yang sudah terpasang dipakai.
    python = find_venv_python() or sys.executable
    if not args.skip_install:
        python = ensure_python_env()
        if not args.no_backend:
            # Pastikan package terinstal di venv / env aktif.
            if args.reinstall:
                BACKEND_MARKER.unlink(missing_ok=True)
            ensure_python_env()
        ensure_frontend()

    # 3) Jalankan
    procs: list[subprocess.Popen] = []

    if not args.no_backend:
        backend_cmd = [
            python, "-m", "uvicorn", "app.main:app",
            "--host", args.host,
            "--port", str(args.backend_port),
        ]
        procs.append(
            _spawn_logged(backend_cmd, BACKEND_DIR, BACKEND_DIR / "run.backend.log")
        )

    if not args.no_frontend:
        os.environ.setdefault(
            "WAYANG_BACKEND_URL", f"http://127.0.0.1:{args.backend_port}/api"
        )
        frontend_cmd = [
            shutil.which("npm") or "npm", "run", "dev", "--",
            "--hostname", args.host,
            "--port", str(args.frontend_port),
        ]
        procs.append(
            _spawn_logged(frontend_cmd, FRONTEND_DIR, FRONTEND_DIR / "run.frontend.log")
        )

    if not procs:
        die("Tidak ada proses untuk dijalankan (periksa flag --no-*).")

    info("\n=== Wayang Bali Learning Platform ===")
    info(f"  Backend  (API)  : http://{args.host if args.host != '0.0.0.0' else 'localhost'}:{args.backend_port}/api/docs")
    info(f"  Frontend (Web)  : http://{args.host if args.host != '0.0.0.0' else 'localhost'}:{args.frontend_port}")
    info("  Tekan Ctrl+C untuk berhenti.\n")

    def _signal_handler(signum, frame):  # noqa: ANN001
        info("\nMenerima sinyal, mematikan semua proses…")
        for p in procs:
            try:
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            except Exception:
                try:
                    p.terminate()
                except Exception:
                    pass
        sys.exit(0)

    signal.signal(signal.SIGINT, _signal_handler)
    signal.signal(signal.SIGTERM, _signal_handler)

    try:
        for p in procs:
            p.wait()
    except KeyboardInterrupt:
        _signal_handler(None, None)
    finally:
        _signal_handler(None, None)


if __name__ == "__main__":
    main()
