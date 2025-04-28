import { createEcmaScriptPlugin } from "@bufbuild/protoplugin";

import { generateTs } from "./generateTs.js";
import { name, version } from "../package.json" assert { type: "json" };

/**
 * Boolean option that turns on generation of the _resource name_ compiler/parser.
 */
const OPT_GENERATE_NAME_PARSER = "generate_name_parser";

const OPT_EMPTY_AS_NULL = "empty_as_null";

export type PluginOptions = {
  emptyAsNull: boolean;
  generateNameParser: boolean;
};

function parseOptions(
  options: {
    key: string;
    value: string;
  }[]
): PluginOptions {
  let generateNameParser = false;
  let emptyAsNull = false;
  for (const { key, value } of options) {
    switch (key) {
      case OPT_EMPTY_AS_NULL: {
        if (!["true", "false"].includes(value)) {
          throw "please provide true or false";
        }
        emptyAsNull = value === "true";
        break;
      }
      case OPT_GENERATE_NAME_PARSER: {
        if (!["true", "false"].includes(value)) {
          throw "please provide true or false";
        }
        generateNameParser = value === "true";
        break;
      }
      default:
        throw new Error();
    }
  }
  return { emptyAsNull, generateNameParser };
}

export const createPlugin = () =>
  createEcmaScriptPlugin({
    name,
    version: `v${version}`,
    generateTs,
    parseOptions,
  });
