<div align="center">
  <h1>Jules | Personal Portfolio & AI Assistant</h1>
  <p>An immersive personal website featuring a 3D AI agent interface</p>

  <br>
</div>

---

<div align="center">

![Static Badge](https://img.shields.io/badge/build-passing-brightgreen)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](https://opensource.org/licenses/Apache-2.0)

<!-- Uncomment when deployed -->
<!-- [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE/deploys) -->

**[Live Site](#)** · **[Documentation](docs/)** · **[Architecture Decisions](docs/adr/)**

</div>

---

## ✨ Features

- **Sentient UI** — Immersive 3D agent with custom GLSL shaders and dithering effects
- **AI Chat** — Conversational interface powered by FastAPI backend with RAG capabilities
- **View Switching** — Seamless transitions between Agent, Resume, Blog, and Contact views
- **Dark/Light Theme** — Full theme support with smooth transitions
- **Classic UI Template** — Traditional multi-page layout preserved for forks

<!-- Add screenshots when available -->
<!-- 
<div align="center">
  <img src="docs/public/sentient-light.gif" alt="Sentient UI Light Mode" style="border-radius: 10px; max-width: 100%;">
  <img src="docs/public/sentient-dark.gif" alt="Sentient UI Dark Mode" style="border-radius: 10px; max-width: 100%;">
</div>
-->

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for AI backend)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/jujubear24/personal_site.git
cd personal_site

# 2. Start the AI backend
docker compose up -d

# 3. Start the frontend
cd services/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the Sentient UI will load by default.

### Environment Variables

Create `services/frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

---

## 🏗️ Architecture

```
personal_site/
├── services/
│   ├── frontend/          # Next.js 14 + React Three Fiber
│   │   ├── src/
│   │   │   ├── app/                 # Sentient UI pages
│   │   │   ├── components/
│   │   │   │   ├── Sentient/        # 3D agent, chat, overlays
│   │   │   │   └── ui/              # shadcn/ui components
│   │   │   ├── classic/             # Preserved Classic UI
│   │   │   └── hooks/               # useChat, etc.
│   │   └── ...
│   └── ai/                # FastAPI backend with RAG
└── docs/
    └── adr/               # Architecture Decision Records
```

### Key Technologies

| Layer | Stack |
|-------|-------|
| **Frontend** | Next.js 14, React Three Fiber, GLSL Shaders, Tailwind CSS |
| **Backend** | FastAPI, Google Gemini, Sentence Transformers |
| **Infrastructure** | Docker, Docker Compose |

---

## 🎨 UI Modes

### Sentient UI (Default)

The immersive 3D experience with:

- Animated sphere agent with custom shaders
- Dithering post-processing effect
- Fullscreen and floating chat modes
- Single-page architecture with view switching

### Classic UI (Template)

A traditional multi-page layout preserved in `src/classic/` for repository forks. To restore:

```bash
cd services/frontend/src
cp -r classic/app/* app/
cp -r classic/components/* components/
```

See [ADR-0003](docs/adr/0003-classic-ui-preservation.md) for details.

---

## 📚 Documentation

- [ADR-0001: Use Docker for Local Development](docs/adr/0001-use-docker-for-local-development.md)
- [ADR-0002: Migrate to Sentient UI](docs/adr/0002-migrate-to-sentient-ui.md)
- [ADR-0003: Classic UI Preservation Strategy](docs/adr/0003-classic-ui-preservation.md)

---

## 🙏 Acknowledgments

This project is forked from [From First Principles](https://github.com/justmeloic/from-first-principles) by **[Loïc Muhirwa](https://github.com/justmeloic/)**. The original project provided the foundation for the AI agent architecture and backend infrastructure.

Key divergences from upstream:

- Sentient UI with 3D WebGL experience (replacing Classic UI as default)
- Docker-based local development for PyTorch compatibility
- Custom theme provider integration

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
