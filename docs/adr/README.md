# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the personal_site project.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. ADRs help us:

- **Track why** decisions were made, not just what was decided
- **Onboard new contributors** quickly with historical context
- **Avoid revisiting** the same discussions repeatedly
- **Document divergence** from the upstream repository

## ADR Format

Each ADR follows a consistent format:

- **Title**: Short noun phrase (e.g., "Use Docker for Local Development")
- **Status**: Draft → Proposed → Accepted → Deprecated/Superseded
- **Context**: What is the issue we're addressing?
- **Decision**: What have we decided to do?
- **Consequences**: What are the trade-offs?

## Creating a New ADR

1. Copy `template.md` to `NNNN-title-with-dashes.md`
2. Fill in all sections
3. Submit as part of your PR
4. Update status to "Accepted" when merged

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-docker-for-local-development.md) | Use Docker for Local Development | Proposed | 2025-01-16 |

## Upstream Divergence

This repository is a fork of [justmeloic/from-first-principles](https://github.com/justmeloic/from-first-principles). ADRs document intentional divergence from the upstream codebase. When considering merging upstream changes, review ADRs to understand what local modifications exist and why.
