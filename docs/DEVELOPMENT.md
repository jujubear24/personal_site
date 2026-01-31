# Local Development Setup

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac/Windows) or Docker Engine (Linux)
- Node.js 18+

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/jujubear24/personal_site.git
cd personal_site

# 2. Set up environment files
cp services/ai/.env.example services/ai/.env
cp services/frontend/.env.development.example services/frontend/.env.development

# 3. Edit services/ai/.env with your GOOGLE_API_KEY

# 4. Start the backend (Docker)
docker compose up

# 5. In another terminal, start the frontend (native)
cd services/frontend
npm install
npm run dev

# 6. Open http://localhost:3000
```

## Architecture

```
┌──────────────────────────┐      ┌──────────────────────────┐
│   Frontend (Native)      │      │   Backend (Docker)       │
│   localhost:3000         │─────▶│   localhost:8081         │
│   npm run dev            │      │   docker compose up      │
└──────────────────────────┘      └──────────────────────────┘
```

## Common Commands

| Command | Description |
|---------|-------------|
| `docker compose up` | Start backend |
| `docker compose up --build` | Rebuild and start backend |
| `docker compose down` | Stop backend |
| `docker compose logs -f` | View backend logs |
| `docker compose exec ai bash` | Shell into backend container |

## Why Docker for Backend Only?

The backend uses PyTorch, which doesn't support Intel Macs in recent versions. Running it in a Linux container solves this. The frontend has no such issues, so it runs natively for best performance.

See [ADR-0001](docs/adr/0001-use-docker-for-local-development.md) for full details.
