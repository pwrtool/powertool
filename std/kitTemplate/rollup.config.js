import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "kit.ts",
  output: [
    {
      format: "cjs",
      file: "index.cjs",
    },
    {
      format: "cjs",
      file: "index.min.cjs",
      plugins: [terser()],
    },
  ],
  plugins: [nodeResolve(), commonjs(), json()],
};
