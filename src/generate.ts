import caxa from "caxa";
import { mkdtemp, cp } from "fs/promises";
import { join, basename, isAbsolute, parse } from "path";
import which from "which";

(async () => {
  const pklScriptPath = process.argv[2];
  const pklScriptName = basename(pklScriptPath);
  if (!pklScriptName.endsWith(".pkl")) {
    throw new Error("Pkl script must be a .pkl file");
  }
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
    output: parse(pklScriptName).name,
    // No need to include the Node runtime
    includeNode: false,
    // pkl eval $script_name
    command: ["{{caxa}}/pkl", "eval", `{{caxa}}/${pklScriptName}`],
  });
})();
