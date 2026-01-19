# Backend Dockerfile for AI service
# Development: docker compose up
# Production: docker build --target production -t personal-site .

FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    UV_SYSTEM_PYTHON=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv

WORKDIR /app

# ──────────────────────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────────────────────
FROM base AS development

# Copy files needed for dependency installation
# README.md is required by pyproject.toml for hatchling build
COPY pyproject.toml uv.lock* README.md ./

RUN uv sync --frozen || uv sync

COPY . .
RUN uv pip install -e .

EXPOSE 8081

# Disable reload to avoid macOS Docker volume deadlock issues
# For hot reload, restart container: docker compose up --build
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8081"]

# ──────────────────────────────────────────────────────────────
# Production (monolith with static frontend)
# ──────────────────────────────────────────────────────────────
FROM base AS production

COPY pyproject.toml uv.lock* README.md ./
RUN uv sync --frozen --no-dev || uv sync --no-dev

COPY . .
RUN uv pip install -e .

# Frontend static files should be in build/static_frontend/
# (built and copied in CI/CD pipeline or multi-stage build)

EXPOSE 8080

CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]