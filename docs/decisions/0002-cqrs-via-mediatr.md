# ADR-0002: CQRS via MediatR

**Status:** Accepted  
**Date:** 2026-05-07

## Context

Controllers need a way to trigger business operations without accumulating logic themselves. Service classes tend to grow into god objects over time. We want a pattern that keeps each operation small, discoverable, and independently changeable.

## Decision

Use the Command/Query Responsibility Segregation (CQRS) pattern implemented with **MediatR**:

- Every write operation is a `record` implementing `IRequest` or `IRequest<T>`, handled by a paired `IRequestHandler`.
- Every read operation is a `record` implementing `IRequest<T>`, handled by a paired `IRequestHandler<TRequest, TResponse>`.
- Controllers contain no business logic — they translate HTTP inputs to MediatR requests and return results.
- Handlers live in `Application/[Feature]/Commands/` and `Application/[Feature]/Queries/`.
- Cross-cutting concerns (validation, logging, authorization checks) are added as MediatR `IPipelineBehavior` rather than polluting handlers.

## Consequences

- Each operation is self-contained: one file, one responsibility, easy to find and modify.
- No service-layer god objects.
- Handlers are straightforward to unit-test by constructing them directly.
- Adding a pipeline behavior (e.g., FluentValidation, performance logging) affects all handlers automatically with zero changes to handler code.
- Slight overhead: every operation requires at minimum two types (request + handler). This is acceptable given the maintainability benefits.
