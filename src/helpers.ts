import {
  type DescEnum,
  type DescExtension,
  type DescField,
  type DescMessage,
  type DescMethod,
  getOption,
  ScalarType,
} from "@bufbuild/protobuf";
import { scalarTypeScriptType } from "@bufbuild/protobuf/codegenv1";
import {
  isWrapperDesc,
  StructSchema,
  ValueSchema,
} from "@bufbuild/protobuf/wkt";
import type { GeneratedFile, Printable } from "@bufbuild/protoplugin";

import { openapiv2_schema } from "../options/gen/protoc-gen-openapiv2/options/annotations_pb";
import { type Schema as OpenApiV2Schema } from "../options/gen/protoc-gen-openapiv2/options/openapiv2_pb";
import { type HttpRule as GoogleapisHttpRule } from "../options/gen/google/api/http_pb";
import { http } from "../options/gen/google/api/annotations_pb";
import { field_behavior } from "../options/gen/google/api/field_behavior_pb";
import {
  type ResourceDescriptor,
  resource,
} from "../options/gen/google/api/resource_pb";
import type { PluginSchema } from "./generateTs";

export const getOpenapiMessageOption = (
  message: DescMessage
): OpenApiV2Schema => {
  return getOption(message, openapiv2_schema);
};

export const getGoogleapisHttpMethodOption = (
  method: DescMethod
): GoogleapisHttpRule => {
  return getOption(method, http);
};

export const getGoogleapisFieldBehaviorOption = (field: DescField) => {
  return getOption(field, field_behavior);
};

export const getGoogleapisResourceOption = (
  message: DescMessage
): ResourceDescriptor => {
  return getOption(message, resource);
};

export const isExternalDependency = (
  schema: PluginSchema,
  message: DescEnum | DescMessage
) => {
  const internalDependency = schema.files.find(
    (file) => file.name === message.file.name
  );
  return !internalDependency;
};

// type from @protobuf but unexported
export type ShapeImport = {
  readonly kind: "es_shape_ref";
  desc: DescEnum | DescMessage;
};

export const isShapeImport = (
  p: Exclude<Printable, Printable[]>
): p is ShapeImport =>
  Boolean(
    p && typeof p === `object` && `kind` in p && p.kind === `es_shape_ref`
  );

export const isWKTMessage = (message: DescEnum | DescMessage) => {
  return message.file.proto.package.startsWith("google.protobuf");
};

// copied from https://github.com/bufbuild/protobuf-es/blob/12974f616a3efeb249c21752f2a7a7b9d99b53f6/packages/protobuf/src/private/names.ts#L142C42-L142C42
export function protoCamelCase(snakeCase: string): string {
  let capNext = false;
  const b: string[] = [];
  for (let i = 0; i < snakeCase.length; i++) {
    let c = snakeCase.charAt(i);
    switch (c) {
      case "_":
        capNext = true;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        b.push(c);
        capNext = false;
        break;
      default:
        if (capNext) {
          capNext = false;
          c = c.toUpperCase();
        }
        b.push(c);
        break;
    }
  }
  return b.join("");
}

const pathParameterNameRe = /{([^}=]+)/g;
/**
 * The path parameters are replaced in runtime with values passed to the request. The fields in the request are by
 * defult camelCased, so we need to convert the path parameters to camelCase as well.
 */
export const pathParametersToLocal = (path: string) => {
  return path.replace(pathParameterNameRe, (_a, c1) => {
    return `{${protoCamelCase(c1)}`;
  });
};

/**
 * Returns a proper TypeScript name for a potentially nested message or enum.
 */
export const getDescName = (d: DescEnum | DescMessage) => {
  let name = d.name;
  let p;
  while ((p = d.parent)) {
    name = `${p.name}_${name}`;
    d = p;
  }
  return name;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coppied from starts
// https://github.com/bufbuild/protobuf-es/blob/ef8766d2aab4764a35bfed78960fc62ec2f0dfac/packages/protoc-gen-es/src/util.ts#L32-L141
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function messageFieldTypeScriptType(
  field: (DescField | DescExtension) & { message: DescMessage },
  imports: GeneratedFile["runtime"]
): Printable {
  if (
    isWrapperDesc(field.message) &&
    !field.oneof &&
    field.fieldKind == "message"
  ) {
    const baseType = field.message.fields[0].scalar;
    return scalarTypeScriptType(baseType, false);
  }
  if (
    field.message.typeName == StructSchema.typeName &&
    field.parent?.typeName != ValueSchema.typeName
  ) {
    return imports.JsonObject;
  }
  return {
    kind: "es_shape_ref",
    desc: field.message,
  };
}

export function fieldTypeScriptType(
  field: DescField | DescExtension,
  imports: GeneratedFile["runtime"]
): {
  typing: Printable;
  optional: boolean;
} {
  const typing: Printable = [];
  let optional = false;
  switch (field.fieldKind) {
    case "scalar":
      typing.push(scalarTypeScriptType(field.scalar, field.longAsString));
      optional = field.proto.proto3Optional;
      break;
    case "message": {
      typing.push(messageFieldTypeScriptType(field, imports));
      optional = true;
      break;
    }
    case "enum":
      typing.push({
        kind: "es_shape_ref",
        desc: field.enum,
      });
      optional = field.proto.proto3Optional;
      break;
    case "list":
      optional = false;
      switch (field.listKind) {
        case "enum":
          typing.push(
            {
              kind: "es_shape_ref",
              desc: field.enum,
            },
            "[]"
          );
          break;
        case "scalar":
          typing.push(
            scalarTypeScriptType(field.scalar, field.longAsString),
            "[]"
          );
          break;
        case "message": {
          typing.push(messageFieldTypeScriptType(field, imports), "[]");
          break;
        }
      }
      break;
    case "map": {
      let keyType: string;
      switch (field.mapKey) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
          keyType = "number";
          break;
        default:
          keyType = "string";
          break;
      }
      let valueType: Printable;
      switch (field.mapKind) {
        case "scalar":
          valueType = scalarTypeScriptType(field.scalar, false);
          break;
        case "message":
          valueType = messageFieldTypeScriptType(field, imports);
          break;
        case "enum":
          valueType = {
            kind: "es_shape_ref",
            desc: field.enum,
          };
          break;
      }
      typing.push("{ [key: ", keyType, "]: ", valueType, " }");
      optional = false;
      break;
    }
  }
  return { typing, optional };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coppied from ends
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
