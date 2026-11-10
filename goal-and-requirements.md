---
id: goal
type: goal-and-requirements
title: protoc-gen-grpc-gateway-es
status: draft
---

# protoc-gen-grpc-gateway-es

## Goal

A protoc plugin that turns protobuf services exposed through grpc-gateway into a minimal TypeScript client: plain types for the JSON the gateway already speaks, and RPC objects that build a `Request`.

## Problem

Gateway JSON is not protobuf binary. A generated client built on protobuf-es message classes adds a serialization layer the gateway does not use, and hides the HTTP mapping (`google.api.http`) the caller actually needs.

## Audience

Authors of browser apps that call a grpc-gateway JSON API. Confirmed.

## Capabilities

- Emits one `*_pb.ts` per proto file: messages as type aliases, enums as string enums, RPCs as `RPC` instances.
- Maps each RPC from `google.api.http` to method, path, and optional body key. An unannotated RPC defaults to `POST` at `/{package}.{Service}/{Method}`.
- `RPC#createRequest` builds a fetch `Request`: path parameters filled and removed from the message, body JSON for non-GET/DELETE, leftover scalars as query parameters, optional bearer token.
- Copies `runtime.ts` beside the generated files. It brands `int64` as `BigIntString` and `bytes` as `BytesString`, and exports conversion helpers. `Timestamp` and `Duration` stay plain strings; the gateway already serializes them.
- Copies comments through as JSDoc. Does not pretty-print; formatting is the caller's job.
- Plugin options: `empty_as_null` (optional non-scalar fields accept `null`, so a PATCH can clear them) and `generate_name_parser` (compile/parse for `google.api.resource` patterns).
- `toPathPattern` rewrites an `RPC.path` into a path-to-regexp pattern for Mock Service Worker.

## Non-goals

- No extra de/serialization and no protobuf-es message classes in the generated output. The wire format is gateway JSON. Confirmed.
- No app-level fetch wrapper. Callers wrap `RPC` themselves. Confirmed.
- Node.js is untested. Generated code targets the browser `fetch` / `Request` API. Confirmed.
- Oneofs are exclusive unions. Reading a member requires an `in` check; the generator does not paper over that. Confirmed.

## Principles

- Stay as thin as the gateway. Type the JSON; do not reinterpret it.
- Type-brand values the gateway stringifies (`int64`, `bytes`) so they cannot be used as ordinary strings.
- A request message passed to `createRequest` is not mutated. Path and body fields are stripped on a copy.
