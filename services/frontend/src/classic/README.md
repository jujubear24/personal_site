# Classic UI Template

This directory contains the original Classic UI implementation, preserved for repository forks who prefer a traditional page-based architecture over the Sentient UI.

## Features

- **Multi-page routing** — Separate pages for `/`, `/agent`, `/blog`, `/resume`, `/search`, `/engineering`
- **Traditional navigation** — NavBar with links, no 3D elements
- **Agent chat page** — Dedicated `/agent` route with references panel
- **Blog system** — Markdown rendering with simplification toggle
- **Search** — Full-text and semantic search with filters
- **Lower requirements** — No WebGL needed, faster initial load

## To Use Classic UI Instead of Sentient

### Quick Restore

From `services/frontend/src/`:

```bash
# 1. Copy app pages (overwrites Sentient pages)
cp -r classic/app/* app/

# 2. Copy components (overwrites Sentient components)
cp -r classic/components/* components/

# 3. (Optional) Remove Sentient-specific components
rm -rf components/Sentient

# 4. (Optional) Remove Three.js dependencies to reduce bundle size
npm uninstall @react-three/fiber @react-three/drei @react-three/postprocessing three postprocessing
npm uninstall -D @types/three
```

### What Gets Restored

```bash
classic/
├── app/
│   ├── layout.tsx          → app/layout.tsx
│   ├── page.tsx            → app/page.tsx (home page)
│   ├── agent/              → app/agent/ (chat page)
│   ├── resume/             → app/resume/
│   ├── blog/               → app/blog/
│   ├── engineering/        → app/engineering/
│   └── search/             → app/search/
│
└── components/
    ├── Agent/              → components/Agent/
    ├── Content/            → components/Content/
    ├── Home/               → components/Home/
    ├── Layout/             → components/Layout/
    └── Search/             → components/Search/
```

### Shared Dependencies

Both Classic and Sentient UIs share these (no action needed):

- `lib/api.ts` — FastAPI client
- `lib/utils.ts` — Utility functions
- `components/ui/` — shadcn/ui primitives
- `hooks/` — Common hooks (toast, theme, etc.)
- `providers/` — Theme provider
- `types/` — TypeScript definitions

## Architecture

See [ADR-0003: Classic UI Preservation Strategy](../../../docs/adr/0003-classic-ui-preservation.md) for the full rationale behind this approach.
