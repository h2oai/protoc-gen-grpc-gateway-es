import { expect, test, describe, it } from "bun:test";

import { base64Encode } from "@bufbuild/protobuf/wire";
import fc from "fast-check";
import uInt8ArrayFromBase64 from "es-arraybuffer-base64/Uint8Array.fromBase64";
import uInt8ArrayToBase64 from "es-arraybuffer-base64/Uint8Array.prototype.toBase64";

import {
  BigIntString,
  RPC,
  bytesStringToUint8Array,
  getNameParser,
  pathPatternToParseRegexp,
  replacePathParameters,
  toBigIntString,
  toBytesString,
  unset,
} from "../src/runtime";

describe(`replacePathParameters`, () => {
  it(`should replace path parameters`, () => {
    const path = "/v1/{name=projects/*/documents/*}/{message_id}";
    const parameters = {
      name: "projects/a/documents/b",
      message_id: "XYZ",
    };
    const [replaced, modifiedParameters] = replacePathParameters(
      path,
      parameters,
    );
    expect(replaced).toBe("/v1/projects/a/documents/b/XYZ");
    expect(modifiedParameters).toEqual({});
  });
  it(`should throw if a required path parameter is missing`, () => {
    const path = "/v1/{name=projects/*/documents/*}/{message_id}";
    const parameters = {
      name: "projects/a/documents/b",
    };
    expect(() => replacePathParameters(path, parameters)).toThrow(
      `Missing required path parameter: message_id`,
    );
  });
  it(`should throw if a path parameter is set to an empty string`, () => {
    const path = "/v1/{name=projects/*/documents/*}/{message_id}";
    const parameters = {
      name: "",
      message_id: "XYZ",
    };
    expect(() => replacePathParameters(path, parameters)).toThrow(
      `Path parameter "name" must not be empty`,
    );
  });
  it(`should accept number as a path parameter`, () => {
    const path = "/v1/{id}";
    const parameters = {
      id: 123,
    };
    const [replaced, modifiedParameters] = replacePathParameters(
      path,
      parameters,
    );
    expect(replaced).toBe("/v1/123");
    expect(modifiedParameters).toEqual({});
  });
  it(`should accept BigInt as a path parameter`, () => {
    const path = "/v1/{id}";
    const parameters = {
      id: BigInt("12345678901234567890"),
    };
    const [replaced, modifiedParameters] = replacePathParameters(
      path,
      parameters,
    );
    expect(replaced).toBe("/v1/12345678901234567890");
    expect(modifiedParameters).toEqual({});
  });
});

describe(`RPC`, () => {
  it(`should handle nested path parameters`, () => {
    const path = "/v1/{flip.flap.flop}/{message_id}";
    const parameters = {
      flip: { flap: { flop: `flup` } },
      message_id: "XYZ",
    };
    const rpc = new RPC(`POST`, path);
    const config = {
      basePath: `https://example.test`,
    };
    const request = rpc.createRequest(config, parameters);
    expect(request.url).toBe(`https://example.test/v1/flup/XYZ`);
  });

  it(`should properly distribute path parameters`, async () => {
    const path = `/v1/{flip.name}`;
    const parameters = {
      flip: { name: `flap`, flop: `flup` },
      updateMask: `flop.flup`,
    };
    const rpc = new RPC(`PATCH`, path, "flip");
    const config = { basePath: `https://example.test` };
    const request = rpc.createRequest(config, parameters);
    // the `flip.name` should be in the path, the `updateMask` should be in the queryString
    expect(request.url).toBe(
      `https://example.test/v1/flap?updateMask=flop.flup`,
    );
    const bodyContent = await new Response(request.body).text();
    // the body should contain the `flip` object, b/c/ the `bodyPath` was set to `flip`
    expect(bodyContent).toBe(JSON.stringify(parameters.flip));
  });

  it(`should send all non-path parameters as query-string for http method DELETE`, () => {
    const path = `/v1/{name}`;
    const parameters = {
      name: `flap`,
      flop: [`flup`, `flep`],
    };
    const rpc = new RPC(`DELETE`, path);
    const config = { basePath: `https://example.test` };
    const request = rpc.createRequest(config, parameters);
    // the `flop` shuld be in the queryString
    expect(request.url).toBe(
      `https://example.test/v1/flap?flop=flup&flop=flep`,
    );
  });

  it(`should set Bearer token if provided as a string in config`, () => {
    const path = `/v1/flip`;
    const rpc = new RPC(`GET`, path);
    const config = {
      basePath: `https://example.test`,
      bearerToken: `secret`,
    };
    const request = rpc.createRequest(config, undefined);
    expect(request.headers.get("Authorization")).toBe(`Bearer secret`);
  });

  it(`should set Bearer token if provided as a function`, () => {
    const path = `/v1/flip`;
    const rpc = new RPC(`GET`, path);
    const config = {
      basePath: `https://example.test`,
      bearerToken: () => `psst!`,
    };
    const request = rpc.createRequest(config, undefined);
    expect(request.headers.get("Authorization")).toBe(`Bearer psst!`);
  });

  it(`should prepend full URL basePath`, () => {
    const path = `/v1/flip`;
    const rpc = new RPC(`GET`, path);
    const config = {
      basePath: `https://example.test/api`,
    };
    const request = rpc.createRequest(config, undefined);
    expect(request.url).toBe(`https://example.test/api/v1/flip`);
  });
});

test(`the method for binary enc/de-coding conforms to @bufbuild etalon`, async () => {
  const input = `ăѣ𝔠ծềſģȟᎥ𝒋ǩľḿꞑȯ𝘱𝑞𝗋𝘴ȶ𝞄𝜈ψ𝒙𝘆𝚣1234567890!@#$%^&*()-_=+[{]};:'",<.>/?~𝘈Ḇ𝖢𝕯٤ḞԍНǏ𝙅ƘԸⲘ𝙉০Ρ𝗤Ɍ𝓢ȚЦ𝒱Ѡ𝓧ƳȤѧᖯć𝗱ễ𝑓𝙜Ⴙ𝞲𝑗𝒌ļṃŉо𝞎𝒒ᵲꜱ𝙩ừ𝗏ŵ𝒙𝒚ź1234567890!@#$%^&*()-_=+[{]};:'",<.>/?~АḂⲤ𝗗𝖤𝗙ꞠꓧȊ𝐉𝜥ꓡ𝑀𝑵Ǭ𝙿𝑄Ŗ𝑆𝒯𝖴𝘝𝘞ꓫŸ𝜡ả𝘢ƀ𝖼ḋếᵮℊ𝙝Ꭵ𝕛кιṃդⱺ𝓅𝘲𝕣𝖘ŧ𝑢ṽẉ𝘅ყž1234567890!@#$%^&*()-_=+[{]};:'",<.>/?~Ѧ𝙱ƇᗞΣℱԍҤ١𝔍К𝓛𝓜ƝȎ𝚸𝑄Ṛ𝓢ṮṺƲᏔꓫ𝚈𝚭𝜶Ꮟçძ𝑒𝖿𝗀ḧ𝗂𝐣ҝɭḿ𝕟𝐨𝝔𝕢ṛ𝓼тú𝔳ẃ⤬𝝲𝗓1234567890!@#$%^&*()-_=+[{]};:'",<.>/?~𝖠Β𝒞𝘋𝙴𝓕ĢȞỈ𝕵ꓗʟ𝙼ℕ০𝚸𝗤ՀꓢṰǓⅤ𝔚Ⲭ𝑌𝙕𝘢𝕤 `;
  const inputBinary = new TextEncoder().encode(input);
  const encodedActual = toBytesString(inputBinary);
  const encodedExpected = base64Encode(inputBinary);
  expect(encodedActual as string).toBe(encodedExpected);
  const decodedActual = bytesStringToUint8Array(encodedActual);
  expect(decodedActual).toEqual(inputBinary);
});

test(`the new standard Uint8Array methods works as our toBytesString`, () => {
  const input = `ăѣ𝔠ծềſģȟᎥ𝒋ǩľḿꞑȯ𝘱𝑞𝗋𝘴ȶ𝞄𝜈ψ𝒙𝘆𝚣1234567890!@#$%^&*()-_=+[{]};:'",<.>/?~`;
  const inputBinary = new TextEncoder().encode(input);
  const encodedOur = base64Encode(inputBinary); // encoded with @protobuf/wire function that is the same as our toBytesString
  const encodedStandard = uInt8ArrayToBase64(inputBinary); // encoded with the new standard Uint8Array#toBase64 via a polyfill es-arraybuffer-base64
  expect(encodedOur as string).toBe(encodedStandard);
  const decoded = uInt8ArrayFromBase64(encodedOur); // decode with the new standard Uint8Array.fromBase64 via a polyfill es-arraybuffer-base64
  expect(decoded).toEqual(inputBinary);
});

test(`the toBigIntString function accepts wide range of inputs`, () => {
  // accepts number
  expect(toBigIntString(0) as string).toBe(`0`);
  // accepts string
  expect(toBigIntString(`1`) as string).toBe(`1`);
  // accepts BigInt
  expect(toBigIntString(BigInt(-1)) as string).toBe(`-1`);
  // accepts BigIntString
  expect(toBigIntString(`-1` as BigIntString) as string).toBe(`-1`);
  // throws with invalid string
  expect(() => toBigIntString(`1.1`)).toThrow();
});

describe("getNameParser", () => {
  it(`should provide a parse and compile functions`, () => {
    const pattern = `projects/{project}/documents/{document}/results/{result}`;
    const parser = getNameParser(pattern);
    expect(parser).toEqual({
      compile: expect.any(Function),
      parse: expect.any(Function),
    });
  });
  it(`should parse a according to the pattern`, () => {
    const pattern = `projects/{project}/documents/{document}/results/{result}`;
    const parser = getNameParser(pattern);
    const parsed = parser.parse(`projects/foo/documents/bar/results/baz`);
    expect(parsed).toEqual({
      project: `foo`,
      document: `bar`,
      result: `baz`,
    });
  });
  it(`should parse any non-empty URL safe symbols`, () => {
    fc.assert(
      fc.property(
        fc.webSegment().filter(Boolean),
        fc.webSegment().filter(Boolean),
        (segmentA, segmentB) => {
          const pattern = `projects/{project}/documents/{document}`;
          const parser = getNameParser(pattern);
          const parsed = parser.parse(
            `projects/${segmentA}/documents/${segmentB}`,
          );
          expect(parsed).toEqual({
            project: segmentA,
            document: segmentB,
          });
        },
      ),
    );
  });
  it(`should compile a according to the pattern`, () => {
    const pattern = `projects/{project}/documents/{document}/results/{result}`;
    const parser = getNameParser(pattern);
    const compiled = parser.compile({
      project: `foo`,
      document: `bar`,
      result: `baz`,
    });
    expect(compiled).toBe(`projects/foo/documents/bar/results/baz`);
  });
});

describe("pathPatternToParseRegexp", () => {
  it(`should convert a path pattern to a regular expression ready string`, () => {
    const reReady = pathPatternToParseRegexp(
      `projects/{project}/documents/{document}/results/{result}`,
    );
    expect(reReady).toBe(
      `projects\\/(?<project>[^/]+)\\/documents\\/(?<document>[^/]+)\\/results\\/(?<result>[^/]+)`,
    );
  });
});

describe("unset", () => {
  it(`should remove a key from an object`, () => {
    const obj = { a: 1, b: 2 };
    const modified = unset(obj, "a");
    expect(modified).toEqual({ b: 2 });
  });
  it(`should use a structural clone to avoid mutation`, () => {
    const obj = { a: 1, b: 2 };
    expect(obj).toEqual({ a: 1, b: 2 });
  });
  it(`should handle deeply nested values`, () => {
    const obj = { a: 1, b: 2, c: { cc: { ccc: 3, cd: 4 } } };
    const modified = unset(obj, "c.cc.cd");
    expect(modified).toEqual({ a: 1, b: 2, c: { cc: { ccc: 3 } } } as any);
  });
});
