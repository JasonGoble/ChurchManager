# ADR-0003: Multi-Org Identity Model

**Status:** Accepted  
**Date:** 2026-05-07

## Context

A person can belong to multiple organizations at different levels of the hierarchy — for example, a Deacon who serves both a local campus and the diocese above it. We needed to decide how to represent this without duplicating personal identity data or creating ambiguous ownership of a person's contact information.

## Decision

A person has **exactly one `Member` record** (their home congregation) and **one or more `UserOrganizationRole` rows** for every organization they actively serve in.

| Table | Represents |
|-------|-----------|
| `Member` | *Who you are* — personal identity, contact info, home org |
| `UserOrganizationRole` | *What you do* — role and service relationship in each org |

`ApplicationUser.MemberId` is a single nullable FK pointing to the home `Member` record (one-to-one). It is never a list.

Org-level access in the JWT is computed from `UserOrganizationRole` rows, not from `Member.OrganizationId`, so a person can hold roles at multiple orgs without their `Member` record changing.

## Consequences

- Personal data (contact info, date of birth, profile photo) lives in exactly one place.
- Activity records (attendance, giving) always reference `Member.Id` regardless of which org context the action occurred in — no ambiguity about "which copy" of the person is being referenced.
- Granting a person access to a new org means adding a `UserOrganizationRole` row, not moving or duplicating their `Member` record.
- `GetMembersQuery` with `IncludeChildOrgs=true` lists members *homed* at child orgs; it does not surface a person again just because they hold a role at the parent level via `UserOrganizationRole`.
- A person can only have one "home" org. If someone's home congregation changes, their `Member.OrganizationId` is updated and the previous org retains historical activity records linked to that `Member.Id`.
