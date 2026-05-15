# ADR-0013: Angular Component File Separation

**Status:** Accepted
**Date:** 2026-05-15

## Context

Angular components can be authored with inline `template` and `styles` inside the `.component.ts` file, or with separate `.component.html` and `.component.scss` files referenced via `templateUrl` and `styleUrl`.

The project initially used inline templates for convenience during early development. As components grew (member-form, member-detail exceeded 400 lines), the tradeoffs shifted:

- VS Code's HTML language service does not activate inside TypeScript template strings — no tag autocomplete, attribute suggestions, or Angular Language Service diagnostics
- CSS inside `styles: []` strings receives no property autocomplete, color pickers, or linting
- Formatters (Prettier) and linters cannot independently process embedded HTML/CSS
- Inline templates conflate component logic and markup in a single file, increasing cognitive load for larger components

## Decision

All Angular components use separate `.component.html` and `.component.scss` files. The `.component.ts` file contains only imports, the `@Component` decorator metadata, and the class logic.

- Use `templateUrl` (not `template`)
- Use `styleUrl` (singular, Angular 17+ syntax, not the legacy `styleUrls` array)
- Create the `.scss` file even if initially empty, to avoid needing a future rename

## Consequences

- Full Angular Language Service support: template type-checking, `go to definition`, hover docs on directives and bindings
- CSS tooling (color pickers, property autocomplete, linting) works in `.scss` files
- Consistent structure across all components; new contributors know where to look
- Slightly more files per component, but the IDE handles this well with file grouping
