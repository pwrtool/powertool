import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "kit.ts",
  output: {
    format: "cjs",
    file: "index.cjs",
  },
  plugins: [nodeResolve(), commonjs(), json()],
};
