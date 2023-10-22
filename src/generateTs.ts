import {
  DescEnum,
  DescField,
  DescMessage,
  DescOneof,
  DescService,
} from "@bufbuild/protobuf";
import { Schema } from "@bufbuild/protoplugin";
import {
  type GeneratedFile,
  getFieldTyping,
  localName,
  makeJsDoc,
  Printable,
  ImportSymbol,
} from "@bufbuild/protoplugin/ecmascript";
import {
  getGoogleapisHttpMethodOption,
  getOpenapiMessageOption,
  isImportSymbol,
  pathParametersToLocal,
} from "./helpers";

const runtimeFile = Bun.file(new URL("./runtime.ts", import.meta.url).pathname);
const runtimeFileContent = await runtimeFile.text();
type RuntimeFile = {
  createGetRequest: ImportSymbol;
};
export const getRuntimeFile = (schema: Schema): RuntimeFile => {
  const file = schema.generateFile(`runtime.ts`);
  file.print(runtimeFileContent);
  const createGetRequest = file.export(`createGetRequest`);
  return { createGetRequest };
};

const resolveWKT = (typing: Printable) => {
  if (!Array.isArray(typing)) return typing;
  const type = typing[0] as Exclude<Printable, Printable[]>;
  if (!isImportSymbol(type)) return typing;
  switch (type.name) {
    default:
      return typing;
    case `Duration`:
    case `Timestamp`:
      return [`string`];
  }
};

function generateEnum(schema: Schema, f: GeneratedFile, enumeration: DescEnum) {
  f.print(makeJsDoc(enumeration));
  f.print`export enum ${enumeration} {`;
  for (const value of enumeration.values) {
    if (enumeration.values.indexOf(value) > 0) f.print();
    f.print(makeJsDoc(value));
    f.print`${localName(value)} = "${value.name}",`;
  }
  f.print`}`;
}

function generateField(
  schema: Schema,
  f: GeneratedFile,
  field: DescField,
  openApiV2Required?: string[]
) {
  f.print(makeJsDoc(field));
  const { typing } = getFieldTyping(field, f);
  const resolvedTyping = resolveWKT(typing);
  const required = openApiV2Required?.includes(field.name);
  f.print`${localName(field)}${required ? `` : `?`}: ${resolvedTyping};`;
}

// TODO: this currently prints all fields, like intersection, but we want to print union of types instead
function generateOneof(schema: Schema, f: GeneratedFile, oneof: DescOneof) {
  for (const field of oneof.fields) {
    generateField(schema, f, field);
  }
}

function generateMessage(
  schema: Schema,
  f: GeneratedFile,
  message: DescMessage
) {
  const openApiV2Schema = getOpenapiMessageOption(message);
  f.print(makeJsDoc(message));
  f.print`export type ${message} = {`;
  for (const member of message.members) {
    switch (member.kind) {
      case "oneof":
        generateOneof(schema, f, member);
        break;
      default:
        generateField(schema, f, member, openApiV2Schema?.jsonSchema?.required);
        break;
    }
    f.print();
  }
  f.print`}`;
  for (const nestedEnum of message.nestedEnums) {
    generateEnum(schema, f, nestedEnum);
  }
  for (const nestedMessage of message.nestedMessages) {
    generateMessage(schema, f, nestedMessage);
  }
}

function generateService(
  schema: Schema,
  f: GeneratedFile,
  service: DescService,
  runtimeFile: RuntimeFile
) {
  for (const method of service.methods) {
    const googleapisHttpMethodOption = getGoogleapisHttpMethodOption(method);
    if (!googleapisHttpMethodOption) {
      throw new Error(
        `Missing "option (google.api.http)" for service "${service.name}" and method "${method.name}"`
      );
    }
    if (!googleapisHttpMethodOption.pattern.value) {
      throw new Error(
        `Missing URL in "option (google.api.http)" for service "${service.name}" and method "${method.name}"`
      );
    }
    const path = pathParametersToLocal(
      googleapisHttpMethodOption.pattern.value as string
    );
    f.print(makeJsDoc(method));
    f.print`export const ${service.name}_${method.name} = ${runtimeFile.createGetRequest}<${method.input.name}, ${method.output.name}>("${path}")}
    `;
  }
}

export function generateTs(schema: Schema) {
  const runtimeFile = getRuntimeFile(schema);
  for (const file of schema.files) {
    const f = schema.generateFile(file.name + "_pb.ts");
    f.preamble(file);
    for (const enumeration of file.enums) {
      generateEnum(schema, f, enumeration);
    }
    for (const message of file.messages) {
      generateMessage(schema, f, message);
    }
    for (const service of file.services) {
      generateService(schema, f, service, runtimeFile);
    }
  }
}
