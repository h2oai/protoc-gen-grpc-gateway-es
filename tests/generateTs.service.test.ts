import { test } from "bun:test";

import {
  assertTypeScript,
  findResponseForInputFile,
  getCodeGeneratorRequest,
  getResponse,
} from "./helpers";

test(`should generate simple simple service`, async () => {
  const inputFileName = `simple_service.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      
      service SimpleService {
        rpc GetSimpleMessage(SimpleMessageRequest) returns (SimpleMessageResponse) {
          option (google.api.http) = {get: "/v1/simple_message"};
        }; 
      };
      
      message SimpleMessageRequest {
        string foo = 1;
      };
      
      message SimpleMessageResponse {
        int32 bar = 1;
      };`,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";
    
      export type SimpleMessageRequest = {
        foo?: string;
      }
      
      export type SimpleMessageResponse = {
        bar?: number;
      }

      export const SimpleService_GetSimpleMessage = new RPC<SimpleMessageRequest, SimpleMessageResponse>("GET", "/v1/simple_message");
      `
  );
});

test(`should handle path with path parameter`, async () => {
  const inputFileName = `service_with_path_parameter.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      
      service WithPathParameterService {
        rpc GetWithPathParameter(WithPathParameterRequest) returns (WithPathParameterResponse) {
          option (google.api.http) = {get: "/v1/{name_test=projects/*/documents/*}:customMethod"};
        }; 
      };
      
      message WithPathParameterRequest {
        string name_test = 1;
      };

      message WithPathParameterResponse {
        int32 bar = 1;
      };
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";
    
      export type WithPathParameterRequest = {
        nameTest?: string;
      }
      
      export type WithPathParameterResponse = {
        bar?: number;
      }
      
      export const WithPathParameterService_GetWithPathParameter = new RPC<WithPathParameterRequest, WithPathParameterResponse>("GET", "/v1/{nameTest=projects/*/documents/*}:customMethod");
      `
  );
});

test(`should do proper linking when service reference other file`, async () => {
  const inputFileNameResource = `linking_resource.proto`;
  const inputFileNameService = `linking_service.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileNameResource,
      content: `syntax = "proto3";

      enum FlipEnum {
        FLIP = 0;
        FLAP = 1;
        FLOP = 2;
      };
      
      message FlipMessage {
        FlipEnum flip = 1;
      };
      `,
    },
    {
      name: inputFileNameService,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      import "linking_resource.proto";
      
      service LinkingService {
        rpc GetLinkedResource(GetLinkiedRequest) returns (GetLinkedResponse) {
          option (google.api.http) = {get: "/v1/{name_test=projects/*/documents/*}:customMethod"};
        }; 
      };
      
      message GetLinkiedRequest {
        string name_test = 1;
      };

      message GetLinkedResponse {
        FlipMessage flip = 1;
      };
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFileResource = findResponseForInputFile(
    resp,
    inputFileNameResource
  );
  const outputFileService = findResponseForInputFile(
    resp,
    inputFileNameService
  );
  assertTypeScript(
    outputFileResource.content!,
    `
      export enum FlipEnum {
        FLIP = 'FLIP',
        FLAP = 'FLAP',
        FLOP = 'FLOP',
      }
      
      export type FlipMessage = {
        flip?: FlipEnum;
      }
      `
  );
  assertTypeScript(
    outputFileService.content!,
    `
    import type { FlipMessage } from "./linking_resource_pb";
    import { RPC } from "./runtime";
      
    export type GetLinkiedRequest = {
      nameTest?: string;
    }
    
    export type GetLinkedResponse = {
      flip?: FlipMessage;
    }
    
    export const LinkingService_GetLinkedResource = new RPC<GetLinkiedRequest, GetLinkedResponse>("GET", "/v1/{nameTest=projects/*/documents/*}:customMethod");
      `
  );
});

test(`should support non GET methods`, async () => {
  const inputFileName = `non_get_http_methods.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      import "google/protobuf/empty.proto";
      
      service AllHttpMethodsService {
        rpc DeleteMethod(CommonRequest) returns (google.protobuf.Empty) {
          option (google.api.http) = {delete: "/v1/{name_test=projects/*/documents/*}"};
        };
        rpc PatchMethod(CommonRequest) returns (CommonResponse) {
          option (google.api.http) = {patch: "/v1/{name_test=projects/*/documents/*}"};
        };
        rpc PostMethod(CommonRequest) returns (CommonResponse) {
          option (google.api.http) = {post: "/v1/{name_test=projects/*/documents/*}"};
        };
        rpc PutMethod(CommonRequest) returns (CommonResponse) {
          option (google.api.http) = {put: "/v1/{name_test=projects/*/documents/*}"};
        };
      };
      
      message CommonRequest {
        string name_test = 1;
      };

      message CommonResponse {
        int32 bar = 1;
      };
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";
    
      export type CommonRequest = {
        nameTest?: string;
      }
      
      export type CommonResponse = {
        bar?: number;
      }
      
      export const AllHttpMethodsService_DeleteMethod = new RPC<CommonRequest, {}>("DELETE", "/v1/{nameTest=projects/*/documents/*}");

      export const AllHttpMethodsService_PatchMethod = new RPC<CommonRequest, CommonResponse>("PATCH", "/v1/{nameTest=projects/*/documents/*}");

      export const AllHttpMethodsService_PostMethod = new RPC<CommonRequest, CommonResponse>("POST", "/v1/{nameTest=projects/*/documents/*}");

      export const AllHttpMethodsService_PutMethod = new RPC<CommonRequest, CommonResponse>("PUT", "/v1/{nameTest=projects/*/documents/*}");
      `
  );
});

test(`should convert FieldMask type to string`, async () => {
  const inputFileName = `field_mask_service.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      import "google/api/client.proto";
      import "google/api/field_behavior.proto";
      import "google/protobuf/field_mask.proto";
      
      service FieldMaskService {
        rpc UpdateMethod(UpdateMethodRequest) returns (UpdateMethodResponse) {
          option (google.api.http) = {
            patch: "/v1/{flip.name}",
            body: "flip"
          };
          option (google.api.method_signature) = "flip,update_mask";
        }
      };

      message FlipMessage {
        string name = 1;
      }
      
      message UpdateMethodRequest {
        FlipMessage flip = 1 [(google.api.field_behavior) = REQUIRED];
        google.protobuf.FieldMask update_mask = 2 [(google.api.field_behavior) = REQUIRED];
      };

      message UpdateMethodResponse {
        FlipMessage flip = 1;
      };
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";

      export type FlipMessage = {
        name?: string;
      }
    
      export type UpdateMethodRequest = {
        flip: FlipMessage;
        updateMask: string; // the updateMask should be a string
      }
      
      export type UpdateMethodResponse = {
        flip?: FlipMessage;
      }
      
      export const FieldMaskService_UpdateMethod = new RPC<UpdateMethodRequest, UpdateMethodResponse>("PATCH", "/v1/{flip.name}", "flip");
      `
  );
});

test(`should camel-case the body option`, async () => {
  const inputFileName = `multi_word_body_option.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      import "google/api/annotations.proto";
      import "google/api/client.proto";
      import "google/api/field_behavior.proto";
      
      service MultiWordBodyOptionService {
        rpc CreateMethod(CreateMethodRequest) returns (CreateMethodResponse) {
          option (google.api.http) = {
            post: "/v1/{flip_flep.name}",
            body: "flip_flep"
          };
        }
      };

      message FlipFlepMessage {
        string name = 1;
      }
      
      message CreateMethodRequest {
        FlipFlepMessage flip_flep = 1 [(google.api.field_behavior) = REQUIRED];
      };

      message CreateMethodResponse {
        FlipFlepMessage flip_flep = 1;
      };
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";

      export type FlipFlepMessage = {
        name?: string;
      }
    
      export type CreateMethodRequest = {
        flipFlep: FlipFlepMessage;
      }
      
      export type CreateMethodResponse = {
        flipFlep?: FlipFlepMessage;
      }
      
      export const MultiWordBodyOptionService_CreateMethod = new RPC<CreateMethodRequest, CreateMethodResponse>(
        "POST",
        "/v1/{flipFlep.name}", // this should be camel-cased
        "flipFlep" // this should be camel-cased
      );
      `
  );
});

test(`should handle method w/o google.api.http option`, async () => {
  const inputFileName = `service_without_http_option.proto`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileName,
      content: `syntax = "proto3";

      package test.example.v1;
      
      service WithoutHttpOptionService {
        rpc TestMethod(SimpleMessage) returns (SimpleMessage);
      };

      message SimpleMessage {
        string flip = 1;
      }
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFile = findResponseForInputFile(resp, inputFileName);
  assertTypeScript(
    outputFile.content!,
    `
      import { RPC } from "./runtime";

      export type SimpleMessage = {
        flip?: string;
      }
      
      export const WithoutHttpOptionService_TestMethod = new RPC<SimpleMessage, SimpleMessage>("POST", "/test.example.v1.WithoutHttpOptionService/TestMethod");
      `
  );
});

test(`should handle types from adjacent files`, async () => {
  const inputFileNameService = `service_referencing_message.proto`;
  const inputFileNameMessage = `message_referenced_by_service.proto`;
  const packageName = `test.example.v1`;
  const req = await getCodeGeneratorRequest(`target=ts`, [
    {
      name: inputFileNameService,
      content: `syntax = "proto3";

      package ${packageName};

      import "${inputFileNameMessage}";
      
      service ReferencingAdjaventMessage {
        rpc TestMethod(TestMethodRequest) returns (ReferencedMessage);
      };

      message TestMethodRequest {}
      `,
    },
    {
      name: inputFileNameMessage,
      content: `syntax = "proto3";

      package ${packageName};
      
      message ReferencedMessage {
        string flip = 1;
      }
      `,
    },
  ]);
  const resp = getResponse(req);
  const outputFileService = findResponseForInputFile(
    resp,
    inputFileNameService
  );
  assertTypeScript(
    outputFileService.content!,
    `
      import { RPC } from "./runtime";
      import type { ReferencedMessage } from "./message_referenced_by_service_pb"

      export type TestMethodRequest = {}
      
      export const ReferencingAdjaventMessage_TestMethod = new RPC<TestMethodRequest, ReferencedMessage>("POST", "/test.example.v1.ReferencingAdjaventMessage/TestMethod");
      `
  );
});
