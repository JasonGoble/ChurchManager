# ChurchManager

> **A passion project born from a simple conviction:** churches shouldn't need a six-figure budget to manage their congregation. ChurchManager is a free, open-source alternative to expensive Church Management Systems (ChMS's) — built to give any church, anywhere in the world, access to the tools they need to shepherd their people, coordinate their ministries, and collaborate with the broader body of Christ.

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
ChurchManager/
├── src/
│   ├── ChurchManager.Domain/          # Entities, enums, domain logic
│   ├── ChurchManager.Application/     # CQRS commands/queries, DTOs, interfaces
│   ├── ChurchManager.Infrastructure/  # EF Core, Identity, external services
│   └── ChurchManager.Api/             # Controllers, middleware, startup
└── web/
    └── church-manager-web/            # Angular 21 SPA
```

## Features

| Module | Status |
|--------|--------|
| Organizations | ✅ Hierarchy tree with settings |
| Members | ✅ Profiles, families, tags |
| Groups & Ministries | ✅ Types, leaders, schedules, capacity |
| Attendance | 🔲 Planned |
| Giving | 🔲 Planned |
| Events | 🔲 Planned |
| Sermons | 🔲 Planned |
| Volunteers | 🔲 Planned |
| Communication | 🔲 Planned |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+ / npm 11+](https://nodejs.org)
- [PostgreSQL 16+](https://www.postgresql.org)
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`

## Getting Started

### 1. Database

Create a PostgreSQL database and update the connection string in `src/ChurchManager.Api/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=churchmanager;Username=postgres;Password=yourpassword"
}
```

### 2. JWT Secret

Replace the placeholder secret in `appsettings.json` with a strong random key (≥ 32 characters):

```json
"JwtSettings": {
  "Secret": "your-strong-random-secret-here"
}
```

### 3. Run Migrations

```powershell
$ef = "$env:USERPROFILE\.dotnet\tools\dotnet-ef.exe"
& $ef database update --project src/ChurchManager.Infrastructure --startup-project src/ChurchManager.Api
```

### 4. Start the API

```powershell
dotnet run --project src/ChurchManager.Api
# Listening on http://localhost:5290
# OpenAPI docs: http://localhost:5290/openapi/v1.json
```

### 5. Start the Frontend

```powershell
cd web/church-manager-web
npm install
npm start
# App running at http://localhost:4200
```

### VS Code (Full Stack)

Open the workspace and press **F5** (or select **Full Stack** from the Run & Debug panel) to build the API and launch both servers with a Chrome debugger attached.

## Default Seed Data

On first run the database is seeded with:

- A root organization (*My Church*)
- An admin user — `admin@churchmanager.com` / `Admin@1234`
- Seven default group types (Small Group, Ministry Team, Bible Study, Prayer Group, Youth, Children, Leadership Team)

## Architecture Notes

- **Clean Architecture** — dependency flow is strictly Domain → Application → Infrastructure/API.
- **CQRS via MediatR** — every read is a `Query`, every write is a `Command`; no business logic in controllers.
- **Soft deletes** — `Member`, `Group`, `GroupType`, `Sermon`, and `ChurchEvent` use an `IsDeleted` flag with a global EF query filter.
- **Auditing** — all entities inherit from `AuditableEntity` which stamps `CreatedAt` / `UpdatedAt` and scopes records to an `OrganizationId`.
- **String enums** — the API serializes all enums as strings (`JsonStringEnumConverter`).
- **Angular signals** — all component state uses `signal()` / `computed()`; no `BehaviorSubject` or manual change detection.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes and push
3. Open a pull request against `main`
