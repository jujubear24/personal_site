# 0002: Migrate to Sentient UI

- **Status**: Proposed
- **Date**: 2026-01-31
- **Authors**: @jujubear24

## Context

The personal website frontend currently uses a "Classic" UI built with Next.js 13+ App Router, featuring:

- Traditional page-based navigation (`/`, `/agent`, `/blog`, `/resume`, `/search`)
- Separate dedicated pages for each section
- Standard component architecture with shadcn/ui

A new "Sentient" UI has been developed with:

- Single-page application (SPA) architecture with client-side view switching
- 3D animated agent using React Three Fiber and custom GLSL shaders
- Fullscreen and floating chat modes
- High-end editorial visual design with dithering effects
- Modern, immersive user experience

The goals are:

1. Adopt the Sentient UI as the primary user experience
2. Maintain compatibility with the existing FastAPI backend (preserving RAG functionality)
3. Preserve the Classic UI as a template for repository forks

## Decision

We will **replace the default UI with the Sentient UI** while **preserving the Classic UI as a template** in a dedicated `classic/` directory under `services/frontend/src/`.

### Key implementation decisions

**Backend Integration:** The Sentient UI will use the existing FastAPI backend (`/api/v1/root_agent/`) rather than the Gemini API it was originally built with. This maintains our RAG functionality and existing infrastructure.

**Routing Strategy:** Convert the Sentient SPA to Next.js App Router:

- `/` → Sentient main view (default to Agent)
- View switching handled client-side within a single page
- Resume/Blog/Contact rendered as overlays, not separate routes

**Classic UI Preservation:** Move current Classic UI to `classic/` directory:

- `classic/app/` → Page implementations
- `classic/components/` → Classic-specific components
- `classic/README.md` → Instructions for restoration

**Shared Resources:** These remain in place for both UIs:

- `lib/api.ts` → FastAPI client
- `components/ui/` → shadcn/ui primitives
- `hooks/` → Common hooks
- `providers/` → Theme provider

**3D Performance:** Use Next.js dynamic imports with `ssr: false` for Three.js components to prevent SSR issues and enable code splitting.

## Consequences

### Positive

- Modern, immersive UX with 3D visuals
- No changes needed to FastAPI backend — preserves RAG functionality
- Repository forks can choose either UI style
- Both UIs share common utilities and API client

### Negative

- Increased bundle size (~200KB+ gzipped for Three.js and postprocessing)
- WebGL required for full experience
- Two UI codebases to maintain (though Classic is static/archived)

### Neutral

- SPA-style navigation may affect SEO, but personal site SEO is not critical
- Blog/Resume content delivery mechanism unchanged

## Alternatives Considered

### Alternative 1: Side-by-side route groups

Use Next.js route groups to serve both UIs simultaneously (`/(classic)/...` and `/(sentient)/...`). Rejected because it adds runtime complexity and larger bundles for a feature most users won't need.

### Alternative 2: Separate repository

Create a new repository for Sentient UI. Rejected because it duplicates infrastructure and makes it harder to share code between UIs.

### Alternative 3: Full replacement without preservation

Delete Classic UI entirely. Rejected because Classic UI has value as a simpler template and fallback option for forks.

### Alternative 4: Keep Gemini API integration

Use Gemini API for Sentient chat instead of FastAPI. Rejected because it loses RAG functionality over resume/content which is a core feature.

## References

- [ADR-0003: Classic UI Preservation Strategy](0003-classic-ui-preservation.md)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)