# ADR-0005: Two-Tier Privacy Model for Cross-Org Member Visibility

**Status:** Accepted  
**Date:** 2026-05-07

## Context

Parent organizations can query members homed at child orgs (via `IncludeChildOrgs=true`). A member's contact details should not be exposed to arbitrary parent-org viewers without consent, but members who actively serve in an org have implicitly consented to that org seeing their information.

## Decision

Apply a two-tier rule when returning members visible through the org hierarchy:

**Tier 1 — Explicit role in the viewing org**  
If the member has a `UserOrganizationRole` row for the requesting `organizationId`, return their **full profile** (all contact fields). They actively chose to serve in that org, which constitutes implicit consent.

**Tier 2 — Hierarchy-only visibility**  
If the member is visible only because they are homed at a child org (no explicit `UserOrganizationRole` at the viewing org), return a **reduced profile**: `Email`, `PhoneNumber`, and `Address`/`City`/`State`/`PostalCode` are `null` *unless* the member has opted in via the corresponding `ShareXWithNetwork` flag.

The three opt-in flags on `Member` are:
- `SharePhoneWithNetwork` (default `false`)
- `ShareEmailWithNetwork` (default `false`)
- `ShareAddressWithNetwork` (default `false`)

Members can toggle these on their own profile page.

## Consequences

- Contact information is private by default; no accidental exposure when orgs are linked.
- Members who serve across multiple orgs (e.g., a shared worship leader) get full visibility everywhere they hold a role, without having to manually opt in.
- The filtering logic lives in `GetMembersQuery` and is applied server-side, so no client can bypass it by crafting a request.
- Adding new sensitive fields in the future requires a conscious decision: either add a new `ShareXWithNetwork` flag or treat the field as always-visible — there is no accidental middle ground.
