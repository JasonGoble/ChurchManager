# ADR-0007: JWT Claims Strategy for Multi-Org Access

**Status:** Accepted  
**Date:** 2026-05-07

## Context

The API needs to enforce that a user can only read/write data belonging to organizations they are authorized to access. Because org visibility flows down the hierarchy (a Diocese admin sees all campus data), a simple single `org_id` claim is insufficient. We needed a claim design that handles subtree access without a database call on every request.

## Decision

On login, the server computes the full set of accessible org IDs and encodes them into the JWT as **multiple `accessible_org` claims** — one per org ID. `IOrganizationHierarchyService` is used to expand each `UserOrganizationRole` row into the full subtree of descendants.

Additional claims issued at login:

| Claim | Value | Notes |
|-------|-------|-------|
| `accessible_org` | `"42"` (repeated) | One claim per accessible org ID |
| `member_id` | `"17"` | Set only if `ApplicationUser.MemberId` is populated |
| `system_admin` | `"true"` | Set only for the SystemAdmin role; grants access to all orgs |

`ICurrentUserService.GetAccessibleOrganizationIds()` reads the `accessible_org` claims from `HttpContext` and returns them as `IReadOnlyList<int>`. Controllers and query handlers use this to scope queries without additional DB lookups.

## Consequences

- Authorization is stateless: the JWT is self-contained, no per-request session lookup.
- Subtree expansion happens once at login, not on every API call.
- If a user's org roles change, their existing token retains the old access until it expires (default expiry is configured in `JwtSettings`). Acceptable for now; a future ADR can address token revocation if needed.
- Tokens for users with roles spanning many orgs will be larger. In practice, org hierarchies are shallow (≤ 5 levels), so this is not a concern.
- The `system_admin` claim bypasses all org-scoping checks, so it must only be assigned to verified super-admin accounts. Seeded via `DataSeeder` at startup; no UI to assign it.
