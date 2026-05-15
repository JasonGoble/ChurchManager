# FiveTalents

> *Faithful stewardship for growing churches.*

Inspired by the Parable of the Talents (Matthew 25:14–30), FiveTalents is a free, open-source church management platform built for small-to-mid-sized churches — Anglican, Presbyterian, Lutheran, Methodist, and Reformed traditions especially. It gives any congregation modern tools to shepherd their people, coordinate ministries, and steward resources faithfully, without the complexity or cost of enterprise ChMS software.

> **A note on how this was built:** This project is an experiment in *vibe coding* — the practice of building software through a collaborative, conversational workflow with an AI pair programmer (Claude). Every feature, migration, and architectural decision in this codebase was shaped through that dialogue. The goal is not just a working product, but a demonstration that thoughtful AI-assisted development can produce clean, maintainable, production-quality code.

---

A full-stack church management system built with .NET 10 and Angular 21.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | .NET 10, ASP.NET Core, MediatR, FluentValidation |
| ORM | Entity Framework Core 10, PostgreSQL |
| Auth | ASP.NET Core Identity, JWT Bearer |
| Frontend | Angular 21, Angular Material |
| Architecture | Clean Architecture, CQRS |

## Project Structure

```
FiveTalents/
├── src/
│   ├── FiveTalents.Domain/          # Entities, enums, domain logic
│   ├── FiveTalents.Application/     # CQRS commands/queries, DTOs, interfaces
│   ├── FiveTalents.Infrastructure/  # EF Core, Identity, external services
│   └── FiveTalents.Api/             # Controllers, middleware, startup
└── web/
    └── five-talents-web/            # Angular 21 SPA
```

## Features

| Module | Status |
|--------|--------|
| Organizations | ✅ Hierarchy tree with settings |
| Members | ✅ Profiles, multiple addresses/emails/phones (typed + primary flag), privacy controls, user account linking & invites, admin-only status & org management (move between orgs) |
| Groups & Ministries | ✅ Types, leaders, schedules, capacity |
| User Accounts | ✅ JWT auth, end-to-end invite & account setup flow, My Profile page |
| Attendance | 🔲 Planned |
| Giving | 🔲 Planned |
| Events | 🔲 Planned |
| Sermons | 🔲 Planned |
| Volunteers | 🔲 Planned |
| Communication | 🔲 Planned |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+ / npm 11+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — runs PostgreSQL and Mailpit
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`

## Getting Started

### 1. Start backing services (database + email)

```powershell
docker compose up db mailpit -d --wait
```

This starts PostgreSQL (port 5433) and Mailpit (port 1025 / UI at `http://localhost:8025`). Migrations and seed data are applied automatically on first API startup.

> **Note:** Port 5433 is used instead of 5432 to avoid conflicts with any locally installed PostgreSQL.

### 2. JWT Secret

Replace the placeholder secret in `src/FiveTalents.Api/appsettings.json` with a strong random key (≥ 32 characters):

```json
"JwtSettings": {
  "Secret": "your-strong-random-secret-here"
}
```

### 3. Start the API

```powershell
dotnet run --project src/FiveTalents.Api
# Listening on http://localhost:5290
# OpenAPI docs: http://localhost:5290/openapi/v1.json
```

### 4. Start the Frontend

```powershell
cd web/five-talents-web
npm install
npm start
# App running at http://localhost:4200
```

### VS Code (recommended)

Press **F5** (or select **Full Stack** from the Run & Debug panel). VS Code will start Docker services, build the API, and launch both servers with Chrome and .NET debuggers attached.

For production, set real SMTP credentials in `appsettings.json`:

```json
"SmtpSettings": {
  "Host": "smtp.yourprovider.com",
  "Port": 587,
  "FromAddress": "noreply@yourdomain.com",
  "FromName": "FiveTalents",
  "Username": "your-smtp-username",
  "Password": "your-smtp-password"
}
```

### VS Code (Full Stack)

Open the workspace and press **F5** (or select **Full Stack** from the Run & Debug panel) to build the API, start Mailpit, and launch both servers with a Chrome debugger attached.

## Default Seed Data

On first run the database is seeded with:

- A root organization (*My Church*)
- An admin user — `admin@FiveTalents.com` / `Admin@1234`
- Seven default group types (Small Group, Ministry Team, Bible Study, Prayer Group, Youth, Children, Leadership Team)

## Architecture Notes

- **Clean Architecture** — dependency flow is strictly Domain → Application → Infrastructure/API.
- **CQRS via MediatR** — every read is a `Query`, every write is a `Command`; no business logic in controllers.
- **Soft deletes** — `Member`, `Group`, `GroupType`, `Sermon`, and `ChurchEvent` use an `IsDeleted` flag with a global EF query filter.
- **Auditing** — all entities inherit from `AuditableEntity` which stamps `CreatedAt` / `UpdatedAt` and scopes records to an `OrganizationId`.
- **String enums** — the API serializes all enums as strings (`JsonStringEnumConverter`).
- **Angular signals** — all component state uses `signal()` / `computed()`; no `BehaviorSubject` or manual change detection.
- **Role-gated admin actions** — Destructive member-account operations (unlink) are restricted to the `SystemAdmin` role at the API level (`[Authorize(Roles = "SystemAdmin")]`). The `isSystemAdmin` flag returned by auth endpoints lets the frontend hide admin controls for regular users.

## Contributing

1. Create a branch: `feature/<issue#>-<slug>` or `fix/<issue#>-<slug>`
2. Commit your changes (include `Closes #N` to auto-close the issue on merge)
3. Open a pull request against `main`
