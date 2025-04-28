import { test } from "bun:test";

import {
  assertTypeScript,
  findResponseForInputFile,
  getCodeGeneratorRequest,
  getResponse,
} from "./helpers";

test(`should generate simple message`, async () => {
  const inputFileName = `simple_message.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message SimpleMessage {
  string foo = 1;
  int32 bar = 2;
  bool baz = 3;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type SimpleMessage = {
  foo?: string;
  bar?: number;
  baz?: boolean;
}`
  );
});

test(`should understand the openapiv2_schema option for required`, async () => {
  const inputFileName = `message_required_via_openapi_option.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

import "protoc-gen-openapiv2/options/annotations.proto";

message OptionMessage {
  option (grpc.gateway.protoc_gen_openapiv2.options.openapiv2_schema) = {
    json_schema: {
      required: [
        "foo"
      ]
    }
  };
  string foo = 1;
  int32 bar = 2;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type OptionMessage = {
  foo: string;
  bar?: number;
}`
  );
});

test(`should properly reference messages`, async () => {
  const inputFileName = `message_references.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

message MessageA {
  string foo = 1;
  MessageB bar = 2;
};

message MessageB {
  string bar = 1;
}`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type MessageA = {
  foo?: string;
  bar?: MessageB;
}

export type MessageB = {
  bar?: string;
}`
  );
});

test(`should handle well-known types`, async () => {
  const inputFileName = `well_known_types.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

import "google/protobuf/duration.proto";
import "google/protobuf/timestamp.proto";
import "google/api/field_behavior.proto";

message MessageWKT {
  string foo = 1;
  google.protobuf.Duration duration = 2;
  google.protobuf.Timestamp timestamp = 3 [(google.api.field_behavior) = OUTPUT_ONLY];
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type MessageWKT = {
  foo?: string;
  duration?: string | null;
  timestamp?: string;
}`
  );
});

test(`should handle oneof`, async () => {
  const inputFileName = `one_of_test.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
      
message OneOfTest {
  string flip = 1;
  int32 flap = 2;
  oneof toss {
    string heads = 3;
    int32 tails = 4;
  }
  oneof hand {
    bool left = 5;
    bool right = 6;
  }
}`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type OneOfTest = 
{
  flip?: string;
  flap?: number;
}
& ({ heads?: string } | { tails?: number })
& ({ left?: boolean } | { right?: boolean });`
  );
});

test(`should handle repeated well-known type`, async () => {
  const inputFileName = `repeated_well_known.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

import "google/protobuf/timestamp.proto";
import "google/api/field_behavior.proto";

message MessageRepeatedWKT {
  string flip = 1;
  repeated google.protobuf.Timestamp timestamp = 2 [(google.api.field_behavior) = OUTPUT_ONLY];
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type MessageRepeatedWKT = {
  flip?: string;
  timestamp?: string[];
}`
  );
});

test(`should convert int64 to BigIntString type`, async () => {
  const inputFileName = `int64_message.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message BigIntMessage {
  int64 size_in_storage = 1;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
import type { BigIntString } from "./runtime";

export type BigIntMessage = {
  sizeInStorage?: BigIntString;
}`
  );
});

test(`should convert bytes to BytesString type`, async () => {
  const inputFileName = `bytes_message.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message BytesMessage {
  bytes content = 1;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
import type { BytesString } from "./runtime";

export type BytesMessage = {
  content?: BytesString;
}`
  );
});

test(`should extract name compile/parser when it is described via google.api.resource option`, async () => {
  const inputFileName = `resource_name.proto`;
  const req = await getCodeGeneratorRequest(
    `target=ts,generate_name_parser=true`,
    [
      {
        name: inputFileName,
        content: `syntax = "proto3";
import "google/api/resource.proto";

message Message {
  option (google.api.resource) = {
    pattern: "foos/{foo}/bars/{bar}"
  };
  string name = 1;
};`,
      },
    ]
  );
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
import { getNameParser } from "./runtime";

export type Message = {
  name?: string;
}

export const messageName = getNameParser<'foo' | 'bar'>('foos/{foo}/bars/{bar}');
`
  );
});

test(`does not use FQN for message name`, async () => {
  const inputFileName = `no_fqn_message.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

package test.example;

message SimpleMessage {
  string foo = 1;
  int32 bar = 2;
  bool baz = 3;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type SimpleMessage = {
  foo?: string;
  bar?: number;
  baz?: boolean;
}`
  );
});

test(`nested enums have prefixed names`, async () => {
  const inputFileName = `nested_enum.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message NestedEnum {
  enum State {
    STATE_FOO = 0;
    STATE_BAR = 1;
  }
  State state = 1;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type NestedEnum = {
  state?: NestedEnum_State;
}
  
export enum NestedEnum_State {
  FOO = 'STATE_FOO',
  BAR = 'STATE_BAR',
}`
  );
});

test(`should generate external dependencies`, async () => {
  const inputFileName = `external_dependencies.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

import "google/rpc/status.proto";

message MessageExternalDep {
  string foo = 1;
  google.rpc.Status status = 2;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
import type { Status } from "./google/rpc/status_pb"

export type MessageExternalDep = {
  foo?: string;
  status?: Status;
}`
  );
  const generatedDependency = findResponseForInputFile(
    resp,
    `google/rpc/status.proto`
  );
});

test(`should handle nested messages`, async () => {
  const inputFileName = `nested_message.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message NestedMessage {
  message Nested {
    string foo = 1;
  }
  repeated Nested bar = 1;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type NestedMessage {
  bar?: NestedMessage_Nested[];
};

export type NestedMessage_Nested = {
  foo?: string;
};`
  );
});

test(`should handle two levels of nested messages`, async () => {
  const inputFileName = `multiple_nested.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";
message MultipleNested {
  message Nested {
    enum State {
      STATE_FOO = 0;
      STATE_BAR = 1;
    }
    State foo = 1;
  }
  Nested bar = 1;
};`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type MultipleNested {
  bar?: MultipleNested_Nested;
};

export type MultipleNested_Nested = {
  foo?: MultipleNested_Nested_State;
};

export enum MultipleNested_Nested_State {
  FOO = 'STATE_FOO',
  BAR = 'STATE_BAR',
}`
  );
});

test(`should type the non-required non-scalar fields as possible 'null' when empty_as_null option is set`, async () => {
  const inputFileName = `empty_as_null.proto`;
  const req = await getCodeGeneratorRequest(`target=ts,empty_as_null=true`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

message MessageA {
  string foo = 1;
  MessageB bar = 2;
  map<string, string> baz = 3;
};

message MessageB {
  string bar = 1;
}`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
export type MessageA = {
  foo?: string;
  bar?: MessageB | null;
  baz?: { [key: string]: string } | null;
}

export type MessageB = {
  bar?: string;
}`
  );
});