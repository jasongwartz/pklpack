import { describe, expect, it } from "@jest/globals";
import { main } from "../src/generate";
import { join } from "path";
import { mkdir, mkdtemp, rmdir, stat } from "fs/promises";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Building pklpack executables", () => {
  // Set env var CLEANUP=0 to leave behind the generated binary and test .pcf file
  it("Can build a binary", async () => {
    await stat(join(__dirname, "../build")).catch(async (err: unknown) => {
      if (
        typeof err === "object" &&
        err &&
        "message" in err &&
        typeof err.message === "string" &&
        err.message.includes("ENOENT")
      ) {
        await mkdir(join(__dirname, "../build"));
      } else {
        throw err;
      }
    });

    const tmpdir = await mkdtemp(join(__dirname, "../build", "test-"));

    // Build a json2pcf executable
    await main(join(__dirname, "../examples/json2pcf.pkl"), {
      outputDirectory: tmpdir,
    });

    // Check that the executable exists
    expect((await stat(join(tmpdir, "json2pcf"))).isFile()).toBeTruthy();

    execSync(
      [
        join(tmpdir, "json2pcf"),
        "-p",
        `in=${join(__dirname, "../package.json")}`,
        "-o",
        join(tmpdir, "package.json.pcf"),
      ].join(" ")
    ).toString();

    expect(
      // Evaluate the generated .pcf file with pkl.
      // execSync() will throw if exit is non-zero.
      () =>
        execSync(["pkl", "eval", join(tmpdir, "package.json.pcf")].join(" "))
    ).not.toThrow();

    if (!("CLEANUP" in process.env) || process.env.CLEANUP !== "0") {
      await rmdir(tmpdir, { recursive: true });
    }
  }, 30_000);
});
