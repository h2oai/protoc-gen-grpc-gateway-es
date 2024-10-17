import { createEcmaScriptPlugin } from "@bufbuild/protoplugin";

import { generateTs } from "./generateTs.js";
import { name, version } from "../package.json" assert { type: "json" };

/**
 * Boolean option that turns on generation of the _resource name_ compiler/parser.
 */
const OPT_GENERATE_NAME_PARSER = "generate_name_parser";

export type PluginOptions = {
  generateNameParser: boolean;
};

function parseOptions(
  options: {
    key: string;
    value: string;
  }[]
): PluginOptions {
  let generateNameParser = false;
  for (const { key, value } of options) {
    switch (key) {
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
  return { generateNameParser };
}

export const createPlugin = () =>
  createEcmaScriptPlugin({
    name,
    version: `v${version}`,
    generateTs,
    parseOptions,
  });
