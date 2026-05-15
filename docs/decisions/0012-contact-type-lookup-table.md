# ADR-0012: ContactType Lookup Table for Member Contact Info

**Status:** Accepted
**Date:** 2026-05-15

## Context

Member contact information (addresses, emails, phone numbers) moved from single-value columns on the `Members` table to normalized one-to-many tables (`MemberAddresses`, `MemberEmails`, `MemberPhones`). Each contact record needed a "type" label (e.g., Home, Work, Personal, Mobile) that is both human-readable and configurable by administrators in the future.

Two options were considered:

1. **String column** — store the label as free text on each contact record. Simple, but no authoritative list; type names can drift inconsistently.
2. **`ContactTypes` lookup table** — a shared reference table seeded with system defaults, with a FK from each contact table. Future admin UI can add/rename/deactivate types without a migration.

## Decision

Use a `ContactTypes` lookup table with a `Category` discriminator (`Address`, `Email`, `Phone`) and a `SortOrder` column. System defaults are seeded via `HasData` in the EF model. Contact records carry a `ContactTypeId` FK.

Admin-managed customization of types is explicitly deferred to a separate feature (related to issue #11 on configurable member status values).

## Consequences

- Type names are consistent and centrally managed; no free-text drift.
- The frontend loads types from `GET /contact-types` and populates dropdowns.
- Future admin UI can extend the list without schema changes.
- Seeded IDs (1–11) are stable; migrations that add new system types must not reuse them.
- The `IsPrimary` flag on each contact record is currently a display-ordering hint only. Behavioral semantics (e.g., "use primary email for invites") should be documented in a new ADR when first consumed programmatically.
