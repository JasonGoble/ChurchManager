# ADR-0006: Application-Layer Abstractions for Infrastructure Services

**Status:** Accepted  
**Date:** 2026-05-07

## Context

Application-layer handlers need to perform operations that require Infrastructure types — creating Identity users, sending email, querying org hierarchy. Directly referencing `UserManager<ApplicationUser>` or `SmtpClient` in a handler would pull Infrastructure into Application, violating the dependency rule from ADR-0001.

## Decision

Every Infrastructure capability used by Application handlers is represented as an **interface defined in Application** and implemented in Infrastructure.

Current abstractions:

| Interface (Application) | Implementation (Infrastructure) | Purpose |
|------------------------|----------------------------------|---------|
| `IApplicationDbContext` | `ApplicationDbContext` | EF Core data access |
| `IEmailService` | `SmtpEmailService` | Sending email |
| `IUserLinkingService` | `UserLinkingService` | Identity user creation, linking, token generation |
| `IOrganizationHierarchyService` | `OrganizationHierarchyService` | BFS subtree of org IDs |
| `ICurrentUserService` | `CurrentUserService` | JWT claim extraction |

The interface carries only the operations that Application actually needs — it is not a mirror of the full implementation API. For example, `IUserLinkingService` exposes five targeted methods rather than wrapping all of `UserManager<T>`.

## Consequences

- Handlers reference only interfaces and Domain types; no Infrastructure imports in the Application project.
- Implementations can be swapped (e.g., replace SMTP with SendGrid) by changing one class in Infrastructure and updating the DI registration — no handler changes required.
- Application handlers are straightforward to unit-test with a mock or in-memory implementation of the interface.
- Each new Infrastructure capability requires a deliberate step: define the interface in Application first, then implement it. This friction is intentional — it keeps the abstraction surface explicit and minimal.
