# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for ChurchManager — lightweight documents that capture the *why* behind significant technical decisions as they are made.

Each ADR is numbered sequentially and never edited after acceptance. If a decision is reversed or superseded, a new ADR is written that references the old one.

## Index

| # | Title | Status |
|---|-------|--------|
| [0001](0001-clean-architecture-layering.md) | Clean Architecture Layering | Accepted |
| [0002](0002-cqrs-via-mediatr.md) | CQRS via MediatR | Accepted |
| [0003](0003-multi-org-identity-model.md) | Multi-Org Identity Model | Accepted |
| [0004](0004-ef-configuration-in-infrastructure.md) | EF Core Configuration in Infrastructure | Accepted |
| [0005](0005-two-tier-cross-org-privacy.md) | Two-Tier Cross-Org Privacy Model | Accepted |
| [0006](0006-application-layer-abstractions.md) | Application-Layer Abstractions for Infrastructure Services | Accepted |
| [0007](0007-jwt-claims-strategy.md) | JWT Claims Strategy for Multi-Org Access | Accepted |
| [0008](0008-member-invite-flow.md) | Member Invite Flow via Identity Password Reset Token | Accepted |
| [0009](0009-angular-signals-first.md) | Angular Signals-First State Management | Accepted |
| [0010](0010-systemadmin-role-enforcement.md) | SystemAdmin Role Enforcement for Destructive Member-Account Operations | Accepted |

## Template

```markdown
# ADR-NNNN: Title

**Status:** Proposed | Accepted | Deprecated | Superseded by [ADR-XXXX](XXXX-title.md)
**Date:** YYYY-MM-DD

## Context
Why was a decision needed? What forces were at play?

## Decision
What was decided?

## Consequences
What are the trade-offs? What becomes easier or harder as a result?
```
