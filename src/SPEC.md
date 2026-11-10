---
id: plugin
type: module-design
title: Plugin entry and options
status: draft
parent: architecture
depends-on:
  - codegen
---

# Plugin entry and options

## Responsibility

Start the protoc plugin and turn its option string into `PluginOptions`.

`src/index.ts` is the published bin (`dist/index.js`, target node). It calls `runNodeJs(createPlugin())`. `src/plugin.ts` builds an EcmaScript plugin named and versioned from `package.json`, with `generateTs` as the generator.

## Boundary

- Allowed: `@bufbuild/protoplugin`, `package.json`, `codegen`.
- Forbidden: reading proto annotations, printing files, importing `runtime.ts` or `options/`. Those belong to `codegen`.

## Options

| Key | Field | Default | Rejected value |
|---|---|---|---|
| `empty_as_null` | `emptyAsNull` | `false` | anything other than `true` / `false` |
| `generate_name_parser` | `generateNameParser` | `false` | anything other than `true` / `false` |

An unknown key throws. Inherited protobuf-es plugin options are accepted by the framework before `parseOptions`; this module does not re-parse them.

What the two flags change in generated types is owned by `codegen`.
