import type { ImportSymbol } from "@bufbuild/protoplugin";

export type RuntimeFile = {
  BigIntString: ImportSymbol;
  BytesString: ImportSymbol;
  RPC: ImportSymbol;
  getNameParser: ImportSymbol;
};

const runtimeFile = Bun.file(new URL("./runtime.ts", import.meta.url).pathname);
const runtimeFileContent = await runtimeFile.text();

export const getRuntimeFileContent = () => runtimeFileContent;
