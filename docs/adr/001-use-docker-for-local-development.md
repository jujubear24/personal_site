# 0001: Use Docker for Local Development

- **Status**: Proposed
- **Date**: 2025-01-16
- **Authors**: @jujubear24

## Context

The upstream repository was designed to run natively on the developer's machine, with the original author deploying the AI backend on a Raspberry Pi at home. The project has the following dependencies that create local development challenges:

1. **Python 3.13+** requirement
2. **PyTorch** for ML/embedding functionality (used by sentence-transformers)
3. **Node.js 18+** for the Next.js frontend
4. **uv** for Python package management

We encountered a blocking issue on Intel-based Macs: PyTorch 2.8.0+ no longer publishes wheels for the `x86_64` macOS platform. The available options were:

- Pin PyTorch to an older version (< 2.3.0) — risks dependency conflicts
- Comment out ML features — leaves untested code paths
- Use platform-specific workarounds — doesn't help other contributors

Additionally, we plan to deploy to a **Linux-based VPS**, making Linux the production target.

## Decision

We will use **Docker and Docker Compose** as the standard local development environment.

This means:

- All contributors run services in Linux containers
- Native installation instructions remain in upstream README but are not our supported path
- Hot-reload is preserved via volume mounts
- The same Docker configuration will be used for production deployment

## Consequences

### Positive

- **Platform independence**: Works on Intel Mac, Apple Silicon, Linux, Windows
- **Dev/prod parity**: Local environment matches production deployment target
- **Simplified onboarding**: Contributors only need Docker installed
- **Reproducible builds**: No "works on my machine" issues
- **Future-proof**: Not dependent on platform-specific package availability

### Negative

- **Docker requirement**: Contributors must have Docker Desktop (or equivalent) installed
- **Resource usage**: Containers consume more RAM than native processes
- **Slight complexity**: Another layer of abstraction to understand
- **Upstream divergence**: Additional files not in original repository

### Neutral

- Debugging requires attaching to containers (VS Code handles this well)
- Build times are cached after first run

## Alternatives Considered

### Alternative 1: Pin PyTorch to older version (< 2.3.0)

This would allow native installation on Intel Macs. Rejected because:

- Creates version drift from upstream
- May cause conflicts with other dependencies expecting newer PyTorch
- Only solves the problem for Intel Mac users
- Doesn't align with production deployment target

### Alternative 2: GitHub Codespaces

Cloud-based development environment that provides Linux containers. Rejected as the primary solution because:

- Requires internet connection
- 60 hours/month free tier may not be sufficient
- Ongoing cost after free tier ($0.18/hour)
- Less control over environment

However, Codespaces remains a valid alternative for contributors who cannot run Docker locally.

### Alternative 3: Comment out PyTorch/ML dependencies

Remove the ML dependencies to allow native installation. Rejected because:

- Leaves code paths untested locally
- Features would break silently
- Not a real solution, just avoidance

## References

- [PyTorch platform support](https://pytorch.org/get-started/locally/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
