---
id: codegen
type: module-design
title: TypeScript code generation
status: draft
parent: architecture
depends-on:
  - runtime
  - options
---

# TypeScript code generation

## Responsibility

Print the output tree for one `CodeGeneratorRequest`: `runtime.ts` once, then `<file>_pb.ts` for every file to generate and for every external message those files reference.

`src/generateTs.ts` owns printing. `src/helpers.ts` owns reading annotations and naming. `src/runtime.macro.ts` inlines `runtime.ts` so the printed copy does not depend on a path at runtime.

## Boundary

- Allowed: `@bufbuild/protobuf` descriptors, `@bufbuild/protoplugin` print API, `options` descriptors, the inlined runtime text.
- Forbidden: implementing request building, path translation, or name parsing. Those live in `runtime` and are only referenced by import symbol. Forbidden: parsing plugin option strings (`plugin` owns that).

## What is printed

- **Enum.** String enum, `localName = "protoName"`. Nested enums are prefixed via `getDescName` (`Parent_Child`).
- **Message.** A type alias, not a class. Oneofs become an intersection of exclusive unions (`{ rest } & ({ a } | { b })`). Nested messages are flattened and prefixed the same way.
- **Field.** Optional unless OpenAPI v2 `required` or `google.api.field_behavior = REQUIRED` says otherwise. `empty_as_null` adds `| null` only to optional non-scalar fields. `Timestamp` and `Duration` are nullable unless required or `OUTPUT_ONLY`, so a caller can unset them.
- **RPC.** `export const Service_Method = new RPC<Input, Output>(method, path, bodyKey?)`. Method and path come from `google.api.http`; path parameter names are camel-cased to match JSON fields. Body key is set only when `body` is present and not `*`. Unannotated → `POST` `/{package}.{Service}/{Method}`.
- **Name parser.** Only when `generate_name_parser` is set and the message has at least one `google.api.resource` pattern. One pattern → `{message}NameParser`; several → `{message}NameParser1`, `NameParser2`, … Each is `getNameParser<Keys>(pattern)`.

## Invariants

- A file is printed at most once (`generatedFiles`).
- External descriptors are pulled in only when a printed field actually references them.
- The `{param}` regex used to build the `Keys` union must match the copy in `runtime`. See `architecture`.
