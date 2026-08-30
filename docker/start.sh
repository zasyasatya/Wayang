#!/bin/sh
# ===========================================================================
# Entrypoint kontainer: menjalankan backend (uvicorn) dan frontend (next start)
# secara bersamaan dalam satu container. Sinyal diteruskan untuk shutdown bersih.
# ===========================================================================
set -e

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
# Di dalam container, backend dan frontend berkomunikasi via localhost.
export WAYANG_BACKEND_URL="${WAYANG_BACKEND_URL:-http://127.0.0.1:${BACKEND_PORT}/api}"

echo "[start] Menjalankan backend pada :${BACKEND_PORT}"
(
  cd /app/backend
  exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${BACKEND_PORT}"
) &
BACKEND_PID=$!

echo "[start] Menjalankan frontend pada :${FRONTEND_PORT}"
(
  cd /app/frontend
  exec npm run start -- --hostname 0.0.0.0 --port "${FRONTEND_PORT}"
) &
FRONTEND_PID=$!

# Forward sinyal & tunggu kedua proses.
trap 'echo "[start] Shutdown..."; kill -TERM ${BACKEND_PID} ${FRONTEND_PID} 2>/dev/null; wait; exit 0' INT TERM

wait ${BACKEND_PID} ${FRONTEND_PID}
