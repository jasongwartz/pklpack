import caxa from "caxa";
import { mkdtemp, cp } from "fs/promises";
import { join, basename, isAbsolute, parse } from "path";
import which from "which";
import * as url from "node:url";

// Check if this file is being directly invoked, ie. is this "main".
// Adapted from: https://2ality.com/2022/07/nodejs-esm-main.html
const isMainModule = (): boolean =>
  import.meta.url.startsWith("file:") &&
  process.argv[1] === url.fileURLToPath(import.meta.url);

export const main = async (
  pklScriptPath: string,
  opts?: {
    outputDirectory?: string;
  }
) => {
  if (!(pklScriptPath && pklScriptPath.endsWith(".pkl"))) {
    throw new Error(
      "Must provide a single argument, which is a path to a .pkl file"
    );
  }
  const pklScriptName = basename(pklScriptPath);
  // TODO: Support multiple .pkl files with a command,
  //       or recursively walk imports.

  const tmpdir = await mkdtemp(`/tmp/pklpack-`);

  // Lookup the path to the local installation of pkl.
  const pklBinary = (await which("pkl", { nothrow: true })) as string | null;
  if (!pklBinary) {
    throw new Error("You must have a 'pkl' binary in your PATH");
  }
  // TODO: Implement pull remote binary based on version and architecture

  // Copy the local binary into the temp directory
  await cp(pklBinary, join(tmpdir, "pkl"));

  // Copy the provided script into the temp directory
  await cp(
    isAbsolute(pklScriptPath)
      ? pklScriptPath
      : join(process.cwd(), pklScriptPath),

    join(tmpdir, pklScriptName)
  );

  await caxa({
    // Temp directory containing the copied pkl binary and the script
    input: tmpdir,
    // Output is single binary, same name as script but without the ".pkl" extension
    output: join(
      opts?.outputDirectory ?? process.cwd(),
      parse(pklScriptName).name
    ),
    // No need to include the Node runtime
    includeNode: false,
    // pkl eval $script_name
    command: ["{{caxa}}/pkl", "eval", `{{caxa}}/${pklScriptName}`],
  });
};

if (isMainModule()) {
  main(process.argv[2]);
}
