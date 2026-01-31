# 0001: Use Docker for Local Development

- **Status**: Proposed
- **Date**: 2025-01-16
- **Authors**: @jujubear24

## Context

The upstream repository was designed to run natively on the developer's machine. The project has the following dependencies:

**Backend (AI service):**

- Python 3.13+
- PyTorch (for sentence-transformers / ML features)
- uv package manager

**Frontend:**

- Node.js 18+
- Next.js

We encountered a blocking issue: **PyTorch 2.8.0+ no longer publishes wheels for Intel Mac (`x86_64`)**. This affects the backend only — the frontend runs fine natively on all platforms.

Additionally, we plan to deploy to a Linux-based VPS, making Linux the production target.

## Decision

We will use **Docker to containerize only the backend (AI service)** for local development.

The frontend will continue to run natively with `npm run dev`.

This means:

- Backend runs in a Linux container (solves PyTorch compatibility)
- Frontend runs natively (best DX, fastest hot reload)
- Production will use a monolith build (static frontend baked into backend container)

### Development workflow

```bash
Terminal 1: docker compose up        # Backend on :8081
Terminal 2: cd services/frontend && npm run dev  # Frontend on :3000
```

## Consequences

### Positive

- **Solves PyTorch issue** without version pinning or removing features
- **Minimal Docker overhead** — only one container
- **Best frontend DX** — native Node.js is faster than containerized
- **Dev/prod alignment** — backend runs on Linux in both environments
- **Simple setup** — contributors only need Docker for backend

### Negative

- **Mixed workflow** — two different ways to run services
- **Upstream divergence** — adds Dockerfile not in original repo

### Neutral

- Frontend developers don't need Docker at all if only working on UI
- Backend changes require Docker; frontend changes don't

## Alternatives Considered

### Alternative 1: Docker for both services

Containerize frontend and backend together. Rejected because:

- Frontend has no platform issues — Docker adds unnecessary overhead
- Native Next.js dev server has better hot reload performance
- More resource usage for no benefit

### Alternative 2: Pin PyTorch to older version

Use PyTorch < 2.3.0 which supports Intel Mac. Rejected because:

- Creates version drift from upstream
- May cause conflicts with other dependencies
- Doesn't align with production target (Linux)

### Alternative 3: Remove ML dependencies

Comment out PyTorch/sentence-transformers. Rejected because:

- Leaves code paths untested
- Features would break silently

## References

- [PyTorch platform support](https://pytorch.org/get-started/locally/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
