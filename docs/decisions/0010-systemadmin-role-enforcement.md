# ADR-0010: SystemAdmin Role Enforcement for Destructive Member-Account Operations

**Status:** Accepted  
**Date:** 2026-05-07

## Context

The member detail page rendered account management actions (Link User, Send Invite, Unlink) for all authenticated users, including the member viewing their own profile. A regular user could therefore unlink their own member-account pairing — an administrative action that should require elevated access. The API endpoint had no role guard either, so the gap was present at both layers.

The JWT already carries a `system_admin` claim (see ADR-0007), but that claim was not being included in the user payload returned by auth endpoints, so the Angular client had no way to make role-based UI decisions.

## Decision

1. **API** — All three member-account operations are decorated with `[Authorize(Roles = "SystemAdmin")]`. Non-admin callers receive 403 Forbidden:
   - `POST /api/members/{id}/link-user`
   - `DELETE /api/members/{id}/link-user`
   - `POST /api/members/{id}/invite`

2. **Auth response** — Both `POST /auth/login` and `POST /auth/setup-account` now include `isSystemAdmin: bool` in the user payload, derived from `UserManager.IsInRoleAsync(user, "SystemAdmin")`. A `BuildUserResponseAsync` helper on `AuthController` avoids duplication between the two endpoints.

3. **Frontend** — `CurrentUser` gains an `isSystemAdmin` field. The member detail component uses a `computed(() => !!currentUser()?.isSystemAdmin)` signal to conditionally render Link User, Send Invite, and Unlink — all three are invisible to regular users.

## Consequences

- The 403 on the API is the real security boundary; the hidden button is a UX convenience, not a security control.
- `isSystemAdmin` is recomputed from Identity on every login/setup-account call, so role changes take effect at the next token refresh.
- All three member-account operations are consistently role-gated at both the API and UI layers.
- Adding `isSystemAdmin` to the auth response does not affect the JWT itself — the `system_admin` claim remains the authoritative source for server-side checks.
