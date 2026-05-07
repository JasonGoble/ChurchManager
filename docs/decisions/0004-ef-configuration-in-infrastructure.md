# ADR-0004: EF Core Configuration Belongs in Infrastructure

**Status:** Accepted  
**Date:** 2026-05-07

## Context

EF Core navigation properties and `IEntityTypeConfiguration` classes need to express relationships between entities. Some of those relationships cross the Domain↔Infrastructure boundary — specifically, `ApplicationUser` (Identity, lives in Infrastructure) has a FK to `Member` (Domain). We needed to decide where relationship configuration lives without violating the Clean Architecture dependency rule (Domain must not reference Infrastructure).

## Decision

All EF relationship configuration — navigation properties, foreign keys, indexes, cascade behaviour — is expressed **in Infrastructure only**, via `IEntityTypeConfiguration<T>` classes or directly in `ApplicationDbContext.OnModelCreating`.

Domain entities carry **no EF-specific attributes** and **no navigation properties** that would require a reference to an Infrastructure type. Plain scalar foreign-key columns (e.g., `Member.UserId`, `Member.OrganizationId`) are acceptable on Domain entities because they are just `string` or `int` — no Infrastructure import required.

The one-to-one relationship between `ApplicationUser` and `Member` is configured entirely from the `ApplicationUser` side:

```csharp
// In ApplicationDbContext (Infrastructure)
builder.Entity<ApplicationUser>()
    .HasOne<Member>()          // no navigation on Member
    .WithOne()
    .HasForeignKey<ApplicationUser>(u => u.MemberId)
    .IsRequired(false)
    .OnDelete(DeleteBehavior.SetNull);
```

## Consequences

- Domain entities remain plain C# classes with no framework coupling — they can be used in tests or other contexts without pulling in EF.
- The Infrastructure project is the single authoritative place for all persistence concerns (mappings, indexes, constraints).
- When a relationship needs to change (e.g., cascade rule), the change is made in one place without touching Domain.
- The trade-off is that navigating from `Member` to `ApplicationUser` in a query requires a manual join rather than a navigation property. This is acceptable because that cross-layer navigation is rare and explicit joins are clearer.
