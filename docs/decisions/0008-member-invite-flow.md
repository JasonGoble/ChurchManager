# ADR-0008: Member Invite Flow via Identity Password Reset Token

**Status:** Accepted  
**Date:** 2026-05-07

## Context

Admins need to grant members access to the app without manually creating passwords for them. The member should receive an email, click a link, and set their own password. We needed a token mechanism that is time-limited and single-use.

## Decision

Reuse ASP.NET Core Identity's built-in **password reset token** for the invite flow:

1. `InviteMemberCommand` creates an `ApplicationUser` with a random placeholder password and `IsActive = false`, then calls `UserManager.GeneratePasswordResetTokenAsync`.
2. The token is URL-encoded and included in an invite link pointing to `/auth/setup-account?email=...&token=...`.
3. `AcceptInviteCommand` (on the `POST /auth/setup-account` endpoint, `[AllowAnonymous]`) calls `UserManager.ResetPasswordAsync(user, token, newPassword)` — Identity validates the token internally.
4. On success, `IsActive` is set to `true` and a JWT is returned so the member is immediately logged in.

Identity's password reset tokens are time-limited (default 24 hours, configurable via `DataProtectionTokenProviderOptions`) and single-use.

## Consequences

- No custom token generation, storage, or expiry logic — Identity handles all of it.
- The same flow works for genuine "forgot password" scenarios by simply not creating a new user first.
- If the invite email fails to send, `InviteMemberCommand` logs a warning but does not throw — the user account is still created and the admin can re-send later. This prevents a half-created state where the DB was rolled back but the user sees an error.
- The invite URL contains the member's email in plaintext in the query string. This is standard practice for password reset flows and acceptable given the link is single-use and short-lived.
- SMTP must be configured in `appsettings.json` for invites to be delivered. If it is not configured, the account is created silently and the admin must inform the member manually.
