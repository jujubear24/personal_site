# 0003: Classic UI Preservation Strategy

- **Status**: Proposed
- **Date**: 2026-01-31
- **Authors**: @jujubear24

## Context

As part of the Sentient UI migration (see [ADR-0002](0002-migrate-to-sentient-ui.md)), we need to preserve the existing Classic UI for repository forks who may prefer:

- A simpler, traditional page-based architecture
- Lower browser requirements (no WebGL dependency)
- Faster initial load times
- A reference implementation for learning Next.js patterns

The Classic UI includes:

- Multi-page routing (`/`, `/agent`, `/blog`, `/resume`, `/search`, `/engineering`)
- Component-based architecture with shadcn/ui
- Dedicated agent chat page with references panel
- Blog with markdown rendering and simplification toggle
- Search with filters and category support

## Decision

We will **preserve the Classic UI in a `classic/` directory** at `services/frontend/src/classic/`, structured as a self-contained template that can be restored by copying files.

### Directory structure

```bash
services/frontend/src/classic/
├── README.md                    # Restoration instructions
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── agent/
│   ├── resume/
│   ├── blog/
│   ├── engineering/
│   └── search/
└── components/
    ├── Agent/
    ├── Content/
    ├── Home/
    ├── Layout/
    └── Search/
```

### Restoration process

Users who fork the repository and want Classic UI will:

1. Copy app pages: `cp -r src/classic/app/* src/app/`
2. Copy components: `cp -r src/classic/components/* src/components/`
3. Optionally remove Sentient dependencies and components

### Shared dependencies

Both UIs share and Classic continues to use:

- `lib/api.ts` — FastAPI client
- `lib/utils.ts` — Utility functions  
- `components/ui/` — shadcn/ui primitives
- `hooks/use-toast.ts` — Toast notifications
- `providers/theme-provider.tsx` — Theme context
- `types/index.ts` — Common TypeScript types

The `@/` import alias points to `src/`, so imports from Classic components to shared code remain valid after moving.

## Consequences

### Positive

- Fork flexibility — users can choose their preferred UI
- Reference implementation — Classic serves as a learning resource
- Fallback option — if Sentient has issues, Classic can be restored
- Clean separation — no runtime switching complexity

### Negative

- Storage overhead — ~50-100KB of preserved code in repository
- Potential drift — Classic may become outdated if shared components change significantly
- Documentation requirement — must clearly document restoration process

### Neutral

- No runtime cost — Classic code isn't loaded unless manually restored
- Git history preserved — Classic changes remain in git for reference

## Alternatives Considered

### Alternative 1: Git branch preservation

Keep Classic UI in a separate git branch. Rejected because it's harder to discover and may drift significantly over time with merge conflicts.

### Alternative 2: npm package

Publish Classic UI as an installable npm package. Rejected as overkill for a template/reference implementation.

### Alternative 3: Documentation only

Don't preserve code, just document how to build a Classic-style UI. Rejected because working code is more valuable than documentation alone.

## References

- [ADR-0002: Migrate to Sentient UI](0002-migrate-to-sentient-ui.md)
