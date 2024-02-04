# `pklpack` - Bundling Pkl scripts as executables

## Example Usage

```sh
# Argument is the path to a Pkl source file.
pklpack <filename>.pkl

# For example:
pklpack examples/json2pcf.pkl
# Then run your resulting binary:
./json2pcf -p in=somefile.json
```

An executable will be written to the working directory, named the same as
the Pkl source file but without the `.pkl` extension.

This output executable contains the Pkl runtime binary, and the specified source file. It can be invoked with all the arguments that would normally be passed
to eg. `pkl eval <filename>`, such as `-p` for "props".

## About

`pklpack` is a tool for [Pkl](https://pkl-lang.org/) developers to bundle the `pkl` executable together with a `.pkl` source file, in order to create a single binary.

This can be useful for writing de-facto command-line utilities with Pkl code. To get input, these utilities can make use of [CLI `props`](https://pkl-lang.org/main/current/pkl-cli/index.html#usage) (like `-p key=value`), environment variables, or STDIN. There are examples of this in the [examples](./examples) directory.

This project makes use of [caxa](https://www.npmjs.com/package/caxa), a successor of [vercel/pkg](https://github.com/vercel/pkg), to package the Pkl binary together with source files and set a "command" - when compressed, this executable is itself smaller than the uncompressed Pkl binary. The `pklpack` executable is also built by `caxa`, but has `caxa` within it in order to create other executables (whoah dude).

### Limitations

Some current limitations during early development are:

- You must have a local Pkl installation in your PATH, this binary will be used as the base
- Each Pkl program must be self-contained in a single file, and not rely on any non-stdlib imports

### Future Roadmap

- Support bundling on top of an arbitrary version of Pkl, and;
- Pull a copy of the Pkl binary if it doesn't exist locally
- Support for multiple Pkl files (eg. script which imports libraries)
- Wiring command-line args to Pkl "props" (ie. so you could make your executable accept `json2pkl file.json` instead of `json2pkl -p in=file.json`)
- Support for cross-"compiling" (really just embedding the Pkl binary of another architecture)

## Development

You'll need a Node developer environment set up, and [`nvm`](https://github.com/nvm-sh/nvm) installed.

- Run `nvm use`, to select the correct version of Node using [`nvm`](https://github.com/nvm-sh/nvm)
- Run `npm install` to pull the dependencies
- Either:
  - run `npm run build` to create the `pklpack` binary, then run `pklpack <filename>`, or
  - run `npm run dev <filename>`, or
  - run `npx ts-node --esm src/generate.ts <filename>`
