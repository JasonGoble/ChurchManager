# ADR-0009: Angular Signals-First State Management

**Status:** Accepted  
**Date:** 2026-05-07

## Context

Angular 17+ introduced signals as the preferred reactive primitive. The older approach of `BehaviorSubject` / `Observable` state in services requires manual subscription management, `async` pipes, and `OnPush` change detection tuning. We needed to decide on a consistent state management approach for the frontend.

## Decision

All component state uses **`signal()`** and **`computed()`**. `BehaviorSubject`, `ReplaySubject`, and manual `subscribe()` calls for local component state are not used.

Rules:
- Component fields that change over time are declared as `signal<T>(initialValue)`.
- Derived values are declared as `computed(() => ...)`.
- HTTP calls (which return `Observable`) are subscribed to once in lifecycle hooks (`ngOnInit`, event handlers) and their results written into signals. The subscription is not stored.
- Services that need to share state across components expose `readonly signal` or `computed` properties (see `AuthService.currentUser`).

## Consequences

- Templates read signal values with `()` syntax — no `async` pipe, no `| json`, no manual `subscribe`/`unsubscribe`.
- Change detection is fine-grained: Angular only re-renders the parts of the template that read a signal that changed.
- `computed()` values are lazily evaluated and cached, eliminating redundant recalculation.
- The codebase stays consistent: a new developer familiar with Angular 17+ signals can follow the pattern without learning a custom state library.
- RxJS is still used for HTTP (`HttpClient` returns `Observable`) and for any genuinely stream-oriented operations. The boundary is: Observables for async I/O, signals for state.
