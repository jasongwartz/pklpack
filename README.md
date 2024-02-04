# Pkl Bundle

## About

`pkl-bundle` is a tool to bundle the `pkl` executable together with a `.pkl` source file, to create a single binary.

This can be useful for writing de-facto command-line utilities with Pkl code, by using CLI `props`, environment variables, or STDIN to provide input.

## Example Usage

```sh
# Argument is the path to a Pkl source file.

# Binary will be written to the local directory, named the same as
# the Pkl source file but without the extension.

pkl-bundle examples/json2pcf.pkl
```

## Development

- Use [`nvm`](https://github.com/nvm-sh/nvm) to select the correct version of Node.
- Run `npm install` to pull the dependencies.
- Either:
  - run `npm build` to create the `pkl-bundle` binary, then run `pkl-bundle <filename>`, or
  - run `npx ts-node --esm src/generate.ts <filename>`
