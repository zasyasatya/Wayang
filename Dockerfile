# ===========================================================================
# Dockerfile — Wayang Bali Learning Platform (Backend + Frontend)
# ---------------------------------------------------------------------------
# Image tunggal yang menjalankan backend FastAPI (uvicorn) dan frontend
# Next.js secara bersamaan. Untuk deployment sederhana.
#
# Build:    docker build -t wayang-bali .
# Run:      docker run -p 8000:8000 -p 3000:3000 wayang-bali
# ===========================================================================

# ---- Tahap 1: dependensi & asset frontend ----
FROM node:22-alpine AS frontend
WORKDIR /app
# Salin manifest lalu install agar layer cache efektif.
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# ---- Tahap 2: environment Python + backend ----
FROM python:3.11-slim AS pythonenv
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
# Dependensi sistem minimal untuk scipy/pillow.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libjpeg-dev \
        zlib1g-dev \
        curl \
        && rm -rf /var/lib/apt/lists/*
# Salin & install requirements Python.
COPY backend/requirements.txt /app/backend/requirements.txt
RUN python -m pip install --no-cache-dir -r /app/backend/requirements.txt

# ---- Tahap 3: image final ----
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=production

# Node runtime + curl untuk healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*

# Sediakan Node.js (untuk menjalankan Next start)
COPY --from=node:22-alpine /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-alpine /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm || true

# Backend Python
COPY --from=pythonenv /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=pythonenv /usr/local/bin /usr/local/bin
COPY backend/ /app/backend/

# Frontend (hasil build + dependencies)
COPY --from=frontend /app/node_modules /app/frontend/node_modules
COPY --from=frontend /app/.next /app/frontend/.next
COPY frontend/package.json frontend/next.config.ts /app/frontend/
COPY frontend/public /app/frontend/public

# Deployment entrypoint
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8000 3000
WORKDIR /app
ENTRYPOINT ["/app/start.sh"]
