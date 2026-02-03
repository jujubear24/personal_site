# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting significant technical decisions made in this project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. ADRs help:

- **Document** why decisions were made
- **Communicate** decisions to current and future team members
- **Track** the evolution of the architecture over time

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-docker-for-local-development.md) | Use Docker for Local Development | Accepted | 2025-01-16 |
| [0002](0002-migrate-to-sentient-ui.md) | Migrate to Sentient UI | Accepted | 2026-01-31 |
| [0003](0003-classic-ui-preservation.md) | Classic UI Preservation Strategy | Accepted | 2026-01-31 |

## Creating a New ADR

1. Copy `template.md` to `XXX-title-of-decision.md`
2. Fill in all sections
3. Update this index
4. Submit for review

## Status Definitions

- **Proposed** - Under discussion, not yet decided
- **Accepted** - Decision has been made and is in effect
- **Deprecated** - No longer applies but kept for historical reference
- **Superseded** - Replaced by a newer ADR (link to replacement)

## Upstream Divergence

This repository is a fork of [justmeloic/from-first-principles](https://github.com/justmeloic/from-first-principles). ADRs document intentional divergence from the upstream codebase.

| Area | Change | ADR |
|------|--------|-----|
| **Development** | Docker for AI backend (PyTorch compatibility) | [0001](0001-use-docker-for-local-development.md) |
| **UI** | Sentient 3D UI as default experience | [0002](0002-migrate-to-sentient-ui.md) |
| **Preservation** | Classic UI available as template | [0003](0003-classic-ui-preservation.md) |
