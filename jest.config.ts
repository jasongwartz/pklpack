import type { JestConfigWithTsJest } from "ts-jest";

// From ts-jest docs on ESM:
// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

export default jestConfig;
