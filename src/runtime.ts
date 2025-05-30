declare const __type__: unique symbol;

/**
 * String containing potentially large integer, which cannot be safely coerced to JavaScript number.
 * Use the provided conversion functions to convert the type to regular JavaScript types.
 */
export type BigIntString = string & { [__type__]: `BigIntString` };

/**
 * Converts the BigIntString into a regular JavaScript bigint.
 */
export const bigIntStringToBigInt: (value: BigIntString) => bigint = BigInt;
/**
 * Converts the BigIntString into a regular JavaScript number.
 * Potentialy dangerous, use `Number.isSafeInteger()` after conversion.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
 */
export const bigIntStringToNumber: (value: BigIntString) => number = Number;
/**
 * Converts the BigIntString into a regular JavaScript string.
 */
export const bigIntStringToString: (value: BigIntString) => string = String;
/**
 * Converts a JavaScript values to BigIntString type.
 */
export const toBigIntString: (
  value: string | bigint | number
) => BigIntString = (v) => String(BigInt(v)) as BigIntString;

/**
 * String containing binary data encoded as base64, used for protobuf bytes fields.
 * Use the provided conversion functions to convert the type from/to Uint8Array.
 */
export type BytesString = string & { [__type__]: `BytesString` };

// lookup table from base64 character to byte
const encTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

// lookup table from base64 character *code* to byte because lookup by number is fast
const decTable: Record<number, number> = {};
for (let i = 0; i < encTable.length; i++) {
  decTable[encTable[i].charCodeAt(0)] = i;
}
// support base64url variants
decTable["-".charCodeAt(0)] = encTable.indexOf("+");
decTable["_".charCodeAt(0)] = encTable.indexOf("/");

/**
 * Converts Uint8Array to BytesString. Thanks @timostamm !
 * @see https://github.com/bufbuild/protobuf-es/blob/5893ec6efb7111d7dbc263aeeb75d693426cacdd/packages/protobuf/src/proto-base64.ts#L42
 */
export const toBytesString = (bytes: Uint8Array): BytesString => {
  const base64 = [];
  let groupPos = 0, // position in base64 group
    p = 0; // carry over from previous byte

  for (const b of bytes) {
    switch (groupPos) {
      case 0:
        base64.push(encTable[b >> 2]);
        p = (b & 3) << 4;
        groupPos = 1;
        break;
      case 1:
        base64.push(encTable[p | (b >> 4)]);
        p = (b & 15) << 2;
        groupPos = 2;
        break;
      case 2:
        base64.push(encTable[p | (b >> 6)]);
        base64.push(encTable[b & 63]);
        groupPos = 0;
        break;
    }
  }

  // add output padding
  if (groupPos) {
    base64.push(encTable[p]);
    base64.push("=");
    if (groupPos == 1) base64.push("=");
  }

  return base64.join(``) as BytesString;
};

/**
 * Converts BytesString to Uint8Array. Thanks @timostamm !
 * @see https://github.com/bufbuild/protobuf-es/blob/5893ec6efb7111d7dbc263aeeb75d693426cacdd/packages/protobuf/src/proto-base64.ts#L97
 */
export const bytesStringToUint8Array = (base64Str: BytesString): Uint8Array => {
  // estimate byte size, not accounting for inner padding and whitespace
  let es = (base64Str.length * 3) / 4;
  if (base64Str.endsWith(`==`)) es -= 2;
  else if (base64Str.endsWith(`=`)) es -= 1;

  const bytes = new Uint8Array(es);
  let bytePos = 0, // position in byte array
    groupPos = 0, // position in base64 group
    b, // current byte
    p = 0; // previous byte
  for (let i = 0, l = base64Str.length; i < l; i++) {
    b = decTable[base64Str.charCodeAt(i)];
    if (b === undefined) {
      switch (base64Str[i]) {
        case "=":
          groupPos = 0; // reset state when padding found
        case "\n":
        case "\r":
        case "\t":
        case " ":
          continue; // skip white-space, and padding
        default:
          throw Error("invalid base64 string.");
      }
    }
    switch (groupPos) {
      case 0:
        p = b;
        groupPos = 1;
        break;
      case 1:
        bytes[bytePos++] = (p << 2) | ((b & 48) >> 4);
        p = b;
        groupPos = 2;
        break;
      case 2:
        bytes[bytePos++] = ((p & 15) << 4) | ((b & 60) >> 2);
        p = b;
        groupPos = 3;
        break;
      case 3:
        bytes[bytePos++] = ((p & 3) << 6) | b;
        groupPos = 0;
        break;
    }
  }
  if (groupPos == 1) throw Error("invalid base64 string.");
  return bytes.subarray(0, bytePos);
};

/**
 * Retrieves property from an object with path specified by dot notation.
 */
export const get = (obj: Record<string, any>, keys: string) => {
  const segments = keys.split(".");
  let value = obj;
  do {
    value = value[segments.shift()!];
  } while (typeof value === `object` && value && segments.length);
  return value;
};

const unsetRecursive = <T extends Record<string, any>>(
  obj: T,
  keys: string[]
): Partial<T> => {
  const key = keys.shift()!;
  if (keys.length === 0) {
    const { [key]: _, ...other } = obj;
    return other as any;
  }
  return {
    ...obj,
    [key]: unsetRecursive(obj[key], keys),
  };
};

/**
 * Deletes property from an object with path specified by dot notation.
 * Returns a new object, does not mutate the original.
 */
export const unset = <T extends Record<string, any>>(
  obj: T,
  keys: string
): Partial<T> => {
  return unsetRecursive(obj, keys.split("."));
};

const leadingSlashRe = /^\/+/;
export const removeLeadingSlash = (path: string) => {
  return path.replace(leadingSlashRe, ``);
};

export const addTrailingSlash = (path: string) => {
  return path.endsWith(`/`) ? path : `${path}/`;
};

export const isScalarType = (
  value: any
): value is boolean | number | string => {
  switch (typeof value) {
    case `object`:
    case `undefined`:
      return false;
    default:
      return true;
  }
};

/**
 * Method that appends key and value to the URLSearchParams object. The value
 * must be a scalar type otherwise it is ignored. Passing `undefined` skips the
 * value as well.
 * @param searchParams
 * @param key
 * @param value
 */
export const appendQueryParameter = (
  searchParams: URLSearchParams,
  key: string,
  value: any
) => {
  if (isScalarType(value)) {
    searchParams.append(key, String(value));
  } else if (typeof value === `object`) {
    console.warn(
      `Property "${key}" in request message is not send in request body, and cannot be send in a query-string parameters because it contains a value of type _object_. Property ${key}" will be skipped.`
    );
  }
};

const pathParameterRe = /{([^}]+)}/g;
/**
 * Replaces path parameters in the path with values from the request message. It also removes the consumed parameters
 * from the request message, so the object passed in is mutated and contains only the remaining fields.
 */
export const replacePathParameters = <RequestMessage>(
  path: string,
  requestMessage?: RequestMessage
): [string, Partial<RequestMessage>] => {
  let requestMessageWOPathParams: Partial<RequestMessage> = requestMessage!;
  const pathWithParams = path.replace(pathParameterRe, (_a, c1) => {
    const parameterPath = c1.split("=", 2)[0] as string;
    // the path might contain dot notaion to nested fields
    const value = requestMessage && get(requestMessage, parameterPath);
    if (value == null) {
      throw new Error(`missing path parameter: ${parameterPath}`);
    }
    if (typeof value !== "string") {
      throw new Error(
        `path parameter "${parameterPath}" must be a string, received "${value}" which is "${typeof value}"`
      );
    }
    // TODO: we can validate the value against the pattern specified in the path
    requestMessageWOPathParams = unset(
      requestMessageWOPathParams,
      parameterPath
    );
    return value;
  });
  return [pathWithParams, requestMessageWOPathParams!];
};

export type RequestConfig = {
  basePath?: string;
  bearerToken?: string | (() => string);
};

// taken from http.proto, only the cusom method is not currently supported
// @see https://github.com/googleapis/googleapis/blob/5ca19108a3251b1cb8dd5b246b37ce2eed2dc92f/google/api/http.proto#L324
export type HttpMethod = `DELETE` | `GET` | `PATCH` | `POST` | `PUT`;

export class RPC<RequestMessage, ResponseMessage> {
  /**
   * HTTP method of the RPC as described by the google.api.http option
   */
  readonly method: HttpMethod;
  /**
   * URL path of the RPC as described by the google.api.http option
   */
  readonly path: string;
  /**
   * Optional: the path to body in RequestMessage, if specified by the google.api.http option
   */
  readonly bodyKey?: string;

  constructor(method: HttpMethod, path: string, bodyKey?: string) {
    this.method = method;
    this.path = path;
    this.bodyKey = bodyKey;
  }

  /**
   * Creates a JavaScript Request object which can be used directly with fetch API. If you are using other HTTP client,
   * you can read the request properties from the Request object.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
   * @param config the request configuration for the RPC
   * @param params the request message for the RPC as defined in the proto file
   */
  createRequest(config: RequestConfig, params: RequestMessage): Request {
    let unconsumedParams: Partial<RequestMessage> | undefined;
    let pathWithParams: string;
    [pathWithParams, unconsumedParams] = replacePathParameters(
      this.path,
      params
    );
    // we must remove leading slash from the path and add trailing slash to the base path, otherwise only the hostname
    // part of the base path will be used :/
    const url = config.basePath
      ? new URL(
          removeLeadingSlash(pathWithParams),
          addTrailingSlash(config.basePath)
        )
      : new URL(pathWithParams, (globalThis as any).location.href);

    let body: string | undefined = undefined;
    if (params && this.method !== `DELETE` && this.method !== `GET`) {
      if (this.bodyKey) {
        body = JSON.stringify(get(params, this.bodyKey));
        unconsumedParams = unset(unconsumedParams, this.bodyKey);
      } else {
        body = JSON.stringify(params);
        unconsumedParams = undefined;
      }
    }

    if (unconsumedParams) {
      for (const [k, v] of Object.entries(unconsumedParams)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            appendQueryParameter(url.searchParams, k, item);
          }
        } else {
          appendQueryParameter(url.searchParams, k, v);
        }
      }
    }

    const headers = new Headers();
    if (body) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }
    const bearerToken =
      typeof config.bearerToken === "function"
        ? config.bearerToken()
        : config.bearerToken;
    if (bearerToken) {
      headers.set("Authorization", `Bearer ${bearerToken}`);
    }

    const request = new Request(url.href, {
      body,
      method: this.method,
      headers,
    });
    return request;
  }

  /**
   * Simple identity function that just types the input as ResponseMessage.
   * Usefull for TypeScript code to assing a type to the response.
   */
  responseTypeId(response: any): ResponseMessage {
    return response as ResponseMessage;
  }
}

/**
 * Given the protobuf option google.api.resource.pattern, return a string that can be compiled into a regexp which will
 * extract the path parameters from a path as a _named_ capture group.
 * @param pathPattern must follow the protobuf option google.api.resource.pattern format
 * @example projects/{project}/documents/{document}/results/{result}
 * @returns
 */
export const pathPatternToParseRegexp = (pathPattern: string): string =>
  pathPattern.replace(/(\/)|(?:\{(\w+)\})/g, ((
    _match: string,
    forwardSlash: string,
    pathParameter: string
  ) => {
    if (forwardSlash) {
      return `\\/`;
    }
    if (pathParameter) {
      return `(?<${pathParameter}>[^/]+)`;
    }
  }) as any);

const reProtoPathPattern = /{([^/]+)}/g;
/**
 * For a protobuf option google.api.resource.pattern, returns a resource name parser and compiler.
 * @param pattern must follow the protobuf option google.api.resource.pattern format
 * @example projects/{project}/documents/{document}/results/{result}
 * @returns parseCompile
 * @param parseCompile.compile a function that takes an object with the path parameters and returns a resource name
 * @param parseCompile.parse a function that takes a resource name and returns an object with the path parameters
 */
export function getNameParser<Keys extends string>(
  pattern: string
): {
  compile: (params: { [key in Keys]: string }) => string;
  parse: (name: string) => { [key in Keys]: string };
} {
  const pathParseRegexpString = pathPatternToParseRegexp(pattern);
  const reParse = new RegExp(pathParseRegexpString);
  const compile = (params: { [key in Keys]: string }) =>
    pattern.replace(
      reProtoPathPattern,
      (_match, paramName: Keys) => params[paramName]
    );
  const parse = (name: string) => {
    const match = name.match(reParse);
    if (!match) {
      throw new Error(`Attempt to parse invalid name: "${name}"`);
    }
    const { groups } = match;
    return groups as { [key in Keys]: string };
  };
  return { compile, parse };
}
