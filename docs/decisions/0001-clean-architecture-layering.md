# ADR-0001: Clean Architecture Layering

**Status:** Accepted  
**Date:** 2026-05-07

## Context

The project needs a structure that keeps business rules isolated from infrastructure concerns (database, identity, email) so that those rules can be tested independently and the infrastructure can be swapped without touching domain logic.

## Decision

Adopt Clean Architecture with four layers and a strict inward-only dependency rule:

```
Domain → Application → Infrastructure
                     → API
```

- **Domain** — entities, enums, value objects, domain events. No references to EF Core, Identity, or any NuGet package beyond the BCL.
- **Application** — CQRS commands/queries, DTOs, and *interfaces* for every infrastructure concern (`IApplicationDbContext`, `IEmailService`, `IUserLinkingService`, etc.). References only Domain.
- **Infrastructure** — EF Core, ASP.NET Core Identity, SMTP, external services. Implements Application interfaces. References Application and Domain.
- **API** — controllers, middleware, DI wiring. References Application (dispatches MediatR requests) and Infrastructure (for DI registration only).

## Consequences

- Application layer commands and queries are portable and testable without spinning up EF or Identity.
- Every cross-layer dependency must go through an interface defined in Application; no `using FiveTalents.Infrastructure` in Application projects.
- Adding a new infrastructure capability (e.g., push notifications) requires: new interface in Application, new implementation in Infrastructure, registered in `DependencyInjection.cs`.
