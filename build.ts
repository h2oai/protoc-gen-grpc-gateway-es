const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  packages: "external",
  outdir: "./dist",
  target: "node",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
}

export {};
