# ADR-0011: Project Rename — ChurchManager → FiveTalents

**Status:** Accepted  
**Date:** 2026-05-13

## Context

The project launched under the working name **ChurchManager** — a descriptive, functional name that conveyed the product category but carried no distinctive identity. As the feature scope and target audience clarified, a stronger brand was needed: one that communicated the theological motivation behind the software, appealed to liturgically-rooted traditions (Anglican, Presbyterian, Lutheran, Reformed), and could grow beyond "church database software."

The rename was also prompted by a practical need: the codebase namespaces (`ChurchManager.*`), solution file, and all project references used the old name, making it the right moment to align code and brand simultaneously.

## Decision

Rename the project to **FiveTalents**, inspired by the Parable of the Talents (Matthew 25:14–30).

All namespaces, project names, solution file, Docker configuration, VS Code tasks, and documentation were updated in a single pass:

| Artifact | Before | After |
|----------|--------|-------|
| Solution file | `ChurchManager.slnx` | `FiveTalents.slnx` |
| Project namespaces | `ChurchManager.*` | `FiveTalents.*` |
| Docker image/service names | `ChurchManager` | `FiveTalents` |
| Database name | `ChurchManager` | `FiveTalents` |
| JWT issuer / audience | `ChurchManager` | `FiveTalents` / `FiveTalentsApp` |
| VS Code launch & task configs | `ChurchManager.Api` | `FiveTalents.Api` |
| Angular frontend directory | `web/church-manager-web` | `web/five-talents-web` |

Brand positioning, taglines, visual identity direction, and media kit content are documented in [docs/brand/media-kit.md](../brand/media-kit.md).

## Consequences

- **Positive:** The name is biblically grounded, memorable, not denomination-specific, and broad enough for future growth beyond member management. It frames every feature (attendance, giving, volunteers, communication) as an act of faithful stewardship rather than administrative record-keeping.
- **Positive:** The theological framing differentiates the product in a market dominated by generic or corporate-feeling ChMS tools.
- **Neutral:** The name does not immediately signal "church software" to an uninformed reader; this is resolved at the tagline/homepage level ("Faithful stewardship for growing churches.").
- **Neutral:** Any existing database instances named `ChurchManager` must be recreated or renamed manually before running migrations against the new configuration.
- **No breaking change to API contracts** — HTTP endpoints, request/response shapes, and JWT claim names are unchanged.
