---
id: runtime
type: module-design
title: Generated runtime
status: draft
parent: architecture
---

# Generated runtime

## Responsibility

The support module copied verbatim into every output tree. Generated `*_pb.ts` files import `RPC`, `BigIntString`, `BytesString`, and `getNameParser` from it. App code may also import `toPathPattern`, the conversion helpers, and `GrpcStatusCode`.

`src/runtime.ts` is the source of that copy. It is not imported by the plugin at generation time.

## Boundary

- Allowed: browser built-ins (`Request`, `URL`, `Headers`, `URLSearchParams`, `Uint8Array`).
- Forbidden: `@bufbuild/protobuf`, plugin source, and `options`. A generated tree must run without the plugin installed.

## Contract

- **Brands.** `BigIntString` and `BytesString` are strings with a phantom tag. Converters (`toBigIntString`, `bigIntStringTo*`, `toBytesString`, `bytesStringToUint8Array`) are the only supported way in or out. Base64 uses `Uint8Array` native methods when present, otherwise the protobuf-es lookup-table implementation.
- **`RPC#createRequest`.** Fills `{param}` (and `{param=pattern}`, using only the name) from the message, rejecting null, `undefined`, `""`, and non-string/number/bigint values. Strips consumed path fields and, when set, the body field, on a copy — the input message is not mutated. GET and DELETE send no body; other methods JSON-stringify `bodyKey` or the whole message. Leftover scalar fields, including array items, become query parameters; leftover objects are skipped with a `console.warn`. `basePath` is joined so a trailing-slash-less base does not drop its path. `bearerToken` may be a string or a zero-arg function. `responseTypeId` is an identity cast, not a parser.
- **`getNameParser`.** `parse` requires a full-string match and throws `Attempt to parse invalid name: "<name>"`. `compile` throws `Missing required path parameter: <param>` or `Path parameter "<param>" must not be empty` — the same wording as `createRequest`.
- **`toPathPattern`.** Rewrites `google.api.http` paths for path-to-regexp v6 (Mock Service Worker): `{jobId}` → `:jobId`, `{flip.name}` → `:flip_name`, `{name=projects/*/documents/*}` → `projects/:project/documents/:document`, `**` → `:name(.+)`, custom-method `:` escaped as `\:`. An optional `basePath` is joined unescaped; pass `*` to match any origin. Not for Express v4 or React Router.
- **`GrpcStatusCode`.** Numeric enum of the canonical gRPC status codes, for callers inspecting gateway error bodies. It is not consulted by `createRequest`.

## Known gap

`replacePathParameters` does not check a value against the pattern embedded in `{name=pattern}`. The pattern is used by `toPathPattern` only.
