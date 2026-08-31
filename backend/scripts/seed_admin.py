#!/usr/bin/env python3
"""Buat/rotasi kredensial admin di ``app/data/users.json``.

Cara pakai:
    python scripts/seed_admin.py                 # pakai default (admin / wayang2026)
    python scripts/seed_admin.py -u admin -p GantiPasswordKu
    python scripts/seed_admin.py -n "Nama Admin" # nama tampilan

File yang dihasilkan berisi hash PBKDF2 (bukan password mentah) sehingga
aman disimpan di sisi server. Hapus file untuk kembali ke kredensial bawaan.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.security import hash_password  # noqa: E402

DATA_FILE = Path(__file__).resolve().parents[1] / "app" / "data" / "users.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed akun admin wayang.")
    parser.add_argument("-u", "--username", default=os.getenv("WAYANG_ADMIN_USERNAME", "admin"))
    parser.add_argument("-p", "--password", default=os.getenv("WAYANG_ADMIN_PASSWORD", "wayang2026"))
    parser.add_argument("-n", "--name", default=os.getenv("WAYANG_ADMIN_NAME", "Admin Wayang"))
    args = parser.parse_args()

    if len(args.password) < 8:
        print("!! Password minimal 8 karakter.", file=sys.stderr)
        sys.exit(1)

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(
        json.dumps(
            {
                "users": [
                    {
                        "username": args.username,
                        "name": args.name,
                        "role": "admin",
                        "password_hash": hash_password(args.password),
                    }
                ]
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"✔ Akun admin tersimpan: {DATA_FILE}")
    print(f"  username: {args.username}")
    print(f"  password: {args.password}")
    print("Hash password disimpan dengan PBKDF2-HMAC-SHA256 (120.000 iterasi).")


if __name__ == "__main__":
    main()
