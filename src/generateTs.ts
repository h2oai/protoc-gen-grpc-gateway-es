import type {
  DescEnum,
  DescField,
  DescFile,
  DescMessage,
  DescOneof,
  DescService,
} from "@bufbuild/protobuf";
import type {
  GeneratedFile,
  Printable,
  Schema,
  ImportSymbol,
} from "@bufbuild/protoplugin";

import { FieldBehavior as GoogleapisFieldBehavior } from "../options/gen/google/api/field_behavior_pb";
import type { PluginOptions } from "./plugin";
import {
  fieldTypeScriptType,
  getGoogleapisFieldBehaviorOption,
  getGoogleapisHttpMethodOption,
  getGoogleapisResourceOption,
  getOpenapiMessageOption,
  isExternalDependency,
  isShapeImport,
  isWKTMessage,
  pathParametersToLocal,
  protoCamelCase,
} from "./helpers";
import { type RuntimeFile, getRuntimeFileContent } from "./runtime.macro" with { type: "macro" };

export type PluginSchema = Schema<PluginOptions>;

/**
 * Prints the runtime file and provides the reference to it's symbols.
 */
export const getRuntimeFile = (schema: PluginSchema): RuntimeFile => {
  const file = schema.generateFile(`runtime.ts`);
  file.print(`/* eslint-disable */`);
  file.print(`// @ts-nocheck`);
  file.print(``);
  file.print(getRuntimeFileContent());
  const filePath = `./runtime`;
  const RPC = file.import(`RPC`, filePath) as ImportSymbol;
  const BigIntString = file.import(
    `BigIntString`,
    filePath,
    true
  ) as ImportSymbol;
  const BytesString = file.import(
    `BytesString`,
    filePath,
    true
  ) as ImportSymbol;
  const getNameParser = file.import(`getNameParser`, filePath) as ImportSymbol;
  return { BigIntString, BytesString, RPC, getNameParser };
};

/**
 * Prints an Enum.
 */
function generateEnum(
  schema: PluginSchema,
  f: GeneratedFile,
  enumeration: DescEnum
) {
  const enumName = [enumeration.parent?.name, enumeration.name]
    .filter(Boolean)
    .join("_");
  f.print(f.jsDoc(enumeration));
  f.print(`export enum ${enumName} {`);
  for (const value of enumeration.values) {
    if (enumeration.values.indexOf(value) > 0) f.print();
    f.print(f.jsDoc(value));
    f.print`${value.localName} = "${value.name}",`;
  }
  f.print`}`;
}

/**
 * The @bufbuild/protobuf library has it's own WKT types which we don't want to use, this function converts them to
 * appropriate scalar types.
 */
function generateType(
  typing: Printable,
  required: boolean,
  fieldBehaviors: GoogleapisFieldBehavior[],
  runtimeFile: RuntimeFile
): { type: Printable; nullable?: boolean } {
  if (Array.isArray(typing)) {
    // in case of an array, there is _usually_ the type in first position and there can be an array `[]` notation at the
    // second position, so we are just intereseted in the first position. Let's see how far this will get us.
    const resolved = generateType(
      typing[0],
      required,
      fieldBehaviors,
      runtimeFile
    );
    return {
      type: [resolved.type, ...typing.slice(1)],
      nullable: resolved.nullable,
    };
  }
  const isWKTRef = isShapeImport(typing) && isWKTMessage(typing.desc);
  if (isWKTRef) {
    switch (typing.desc.name) {
      default:
        return { type: `string` };
      case `Empty`:
        return { type: `{}`, nullable: !required };
      case `Duration`:
      case `Timestamp`:
        // the Duration and Timestamp are serialized to string in gRPC-gateway, but we also need them to be nullable
        // otherwiser it is impossible to unset them.
        return {
          type: `string`,
          nullable:
            !required &&
            !fieldBehaviors.includes(GoogleapisFieldBehavior.OUTPUT_ONLY),
        };
    }
  }
  switch (typing) {
    case `bigint`:
      return { type: runtimeFile.BigIntString };
    case `Uint8Array`:
      return { type: runtimeFile.BytesString };
    default:
      return { type: typing };
  }
}

function generateField(
  schema: PluginSchema,
  f: GeneratedFile,
  field: DescField,
  openApiV2Required: string[] | undefined,
  runtimeFile: RuntimeFile
) {
  f.print(f.jsDoc(field));
  const { typing } = fieldTypeScriptType(field, f.runtime);
  const googleapisFieldBehaviorOptions =
    getGoogleapisFieldBehaviorOption(field);
  const required =
    openApiV2Required?.includes(field.name) ||
    googleapisFieldBehaviorOptions.includes(GoogleapisFieldBehavior.REQUIRED);
  const { type, nullable } = generateType(
    typing,
    required,
    googleapisFieldBehaviorOptions,
    runtimeFile
  );
  f.print`${field.localName}${required ? "" : "?"}: ${type}${
    !nullable ? "" : " | null"
  };`;
  const typeNonArray: Exclude<Printable, Printable[]> = Array.isArray(type)
    ? type[0]
    : (type as any);
  if (
    isShapeImport(typeNonArray) &&
    isExternalDependency(schema, typeNonArray.desc)
  ) {
    generateFile(schema, typeNonArray.desc.file, runtimeFile);
  }
}

const reProtoPathPattern = /{([^/]+)}/g;

function generateNameParser(
  f: GeneratedFile,
  pattern: string,
  symbolName: string,
  runtimeFile: RuntimeFile
) {
  const params = Array.from(pattern.matchAll(reProtoPathPattern)).map(
    (m) => `'${m[1]}'`
  );
  f.print(
    `export const ${symbolName} = `,
    runtimeFile.getNameParser,
    `<${params.join(" | ")}>("${pattern}");`
  );
}

function generateMessage(
  schema: PluginSchema,
  f: GeneratedFile,
  message: DescMessage,
  runtimeFile: RuntimeFile
) {
  const oneOfs: DescOneof[] = [];
  const openApiV2Schema = getOpenapiMessageOption(message);
  const requiredFields = openApiV2Schema?.jsonSchema?.required;
  f.print(f.jsDoc(message));
  f.print(`export type ${message.name} = {`);
  for (const member of message.members) {
    switch (member.kind) {
      case "oneof":
        oneOfs.push(member);
        break;
      default:
        generateField(schema, f, member, requiredFields, runtimeFile);
        break;
    }
  }
  f.print`}`;
  if (oneOfs.length > 0) {
    for (const oneOf of oneOfs) {
      f.print` & (`;
      for (let i = 0, l = oneOf.fields.length; i < l; i++) {
        let field = oneOf.fields[i];
        if (i > 0) f.print` | `;
        f.print`{ `;
        generateField(schema, f, field, requiredFields, runtimeFile);
        f.print` }`;
      }
      f.print`)`;
    }
  }
  f.print`;`;
  for (const nestedEnum of message.nestedEnums) {
    generateEnum(schema, f, nestedEnum);
  }
  for (const nestedMessage of message.nestedMessages) {
    generateMessage(schema, f, nestedMessage, runtimeFile);
  }
  const resourceOption = getGoogleapisResourceOption(message);
  if (
    schema.options.generateNameParser &&
    resourceOption &&
    resourceOption.pattern.length > 0
  ) {
    const symbolPrefix = `${message.name
      .charAt(0)
      .toLocaleLowerCase()}${message.name.slice(1)}Name`;
    if (resourceOption.pattern.length === 1) {
      generateNameParser(
        f,
        resourceOption.pattern[0],
        symbolPrefix,
        runtimeFile
      );
    } else {
      for (let i = 0, pattern; (pattern = resourceOption.pattern[i]); i++) {
        generateNameParser(f, pattern, `${symbolPrefix}${i + 1}`, runtimeFile);
      }
    }
  }
}

const rpcTypeParam = (desc: DescMessage, runtimeFile: RuntimeFile): Printable =>
  generateType({ kind: `es_shape_ref`, desc }, true, [], runtimeFile).type;

function generateService(
  schema: PluginSchema,
  f: GeneratedFile,
  service: DescService,
  runtimeFile: RuntimeFile,
  filePackage?: string
) {
  for (const method of service.methods) {
    const googleapisHttpMethodOption = getGoogleapisHttpMethodOption(method);
    let httpMethod = "POST";
    let path = `/${filePackage}.${service.name}/${method.name}`;
    let bodyPath = undefined;
    if (googleapisHttpMethodOption) {
      if (googleapisHttpMethodOption.pattern.value) {
        httpMethod = googleapisHttpMethodOption.pattern.case.toUpperCase();
        path = pathParametersToLocal(
          googleapisHttpMethodOption.pattern.value as string
        );
      }
      if (
        googleapisHttpMethodOption.body &&
        googleapisHttpMethodOption.body !== "*"
      ) {
        bodyPath = protoCamelCase(googleapisHttpMethodOption.body);
      }
    }
    f.print(f.jsDoc(method));
    f.print(
      `export const ${service.name}_${method.name} = new `,
      runtimeFile.RPC,
      `<`,
      rpcTypeParam(method.input, runtimeFile),
      `,`,
      rpcTypeParam(method.output, runtimeFile),
      `>("${httpMethod}", "${path}"${bodyPath ? `, "${bodyPath}"` : ""});`
    );
  }
}

const generatedFiles = new Set<string>();
const generateFile = (
  schema: PluginSchema,
  file: DescFile,
  runtimeFile: RuntimeFile
) => {
  if (generatedFiles.has(file.name)) return;
  generatedFiles.add(file.name);
  const f = schema.generateFile(file.name + "_pb.ts");
  f.preamble(file);
  for (const enumeration of file.enums) {
    generateEnum(schema, f, enumeration);
  }
  for (const message of file.messages) {
    generateMessage(schema, f, message, runtimeFile);
  }
  for (const service of file.services) {
    generateService(schema, f, service, runtimeFile, file.proto.package);
  }
};

export function generateTs(schema: PluginSchema) {
  const runtimeFile = getRuntimeFile(schema);

  for (const file of schema.files) {
    generateFile(schema, file, runtimeFile);
  }
}
