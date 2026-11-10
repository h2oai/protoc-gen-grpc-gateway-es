---
id: typescript-7-test-migration
type: task-spec
status: draft
title: Revisit TypeScript 7 migration for test comparisons
parent: architecture
references: [codegen]
tags: [tests, typescript, deferred]
---

# Revisit TypeScript 7 migration for test comparisons

## Purpose

Revisit replacing the pinned `typescript@6.0.3` dev dependency with the Go-backed TypeScript 7 compiler when its test API can preserve the generated-output comparison in `tests/helpers.ts`. A beta API is acceptable for this test-only use. No migration has been made yet.

The current helper parses actual and expected TypeScript with `createSourceFile`, prints both with `createPrinter({ removeComments: true })`, and compares the resulting strings. It preserves TypeScript syntax and declaration order while ignoring comments and many formatting differences. It does **not** normalize every layout difference: for example, a one-line function body can print differently from a multiline body.

## Findings from TypeScript 7.1.0-beta

- The [7.1 beta API](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/#typescript-7-1-api) exposes `API.createSourceFile` and `api.printer.printFile` through `typescript/sync` and `typescript/async`. The root `typescript` import is no longer the TypeScript 6 compiler API. This is a parse-and-print path, not JavaScript emission, so it can retain type syntax.
- On macOS arm64 with Bun 1.4.2, `new API()` from `typescript/sync` failed at `stdout._handle.fd`: the synchronous transport uses private Node stream handles unavailable in that Bun runtime. This is an observed runtime/version limitation, not a claim about all Bun versions or platforms.
- The async API worked in Bun, but the beta's [`PrintNodeOptions`](https://unpkg.com/typescript@7.1.0-beta/dist/api/async/api.d.ts) exposes `preserveSourceNewlines`, `neverAsciiEscape`, and `terminateUnterminatedLiterals`, **not** `removeComments`. A direct parse-and-print probe retained a leading JSDoc and trailing comment, so it did not match the current helper's comment-insensitive comparison. Some inline comments were dropped in that probe; do not rely on either preserving or dropping all comments.
- A focused `bun test` in an isolated temporary project passed the TypeScript 6 comment-insensitivity check and failed the equivalent TypeScript 7.1 async comparison: **1 pass, 1 fail**. The repository's full suite was not run during that investigation, and no dependency or test files were changed.
- The async API requires awaiting assertions and disposing the API and source-file leases. The native compiler communicates with JavaScript via a separate process; faster compiler benchmarks do not establish that these small test comparisons will be faster.

## Open items

- [ ] Recheck current TypeScript 7 and Bun versions for synchronous API compatibility and a printer option to remove comments. Reproduce on supported CI platforms, not just macOS.
- [ ] If the sync path is still unavailable, assess an async migration of `assertTypeScript` and all callers, including correct API and source-file disposal. Avoid spawning a compiler per comparison without evaluating its cost.
- [ ] Preserve the existing comparison semantics without stripping comments via a naive regex or transpiling away TypeScript types. If a syntax-aware workaround is needed, assess its complexity before adopting it.
- [ ] Add focused tests covering comments, ordinary formatting differences, preserved type syntax, changed symbol order, and the existing single-line/multiline limitation; run `bun test` for the whole repository.
- [ ] If feasible, update `package.json` and the Bun lockfile, verify relevant checks, and compare test runtime before claiming a speedup. Otherwise retain TypeScript 6 and update these findings.
