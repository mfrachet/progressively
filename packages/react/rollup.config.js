import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const external = ["react"];

export default () => {
  const ssr = {
    input: "src/ssr.ts",
    output: {
      dir: "lib",
      format: "cjs",
    },
    plugins: [nodeResolve(), typescript({ outDir: "lib" }), terser()],
    external,
  };

  const legacy = {
    input: "src/index.tsx",
    output: {
      dir: "lib/legacy",
      format: "umd",
    },
    plugins: [
      nodeResolve(),
      typescript({ outDir: "lib/legacy", target: "es5" }),
      terser(),
    ],
    external,
  };

  const modern = {
    input: "src/index.tsx",
    output: {
      dir: "lib/modern",
      format: "umd",
    },
    plugins: [
      nodeResolve(),
      typescript({ outDir: "lib/modern", target: "ESNext" }),
      terser(),
    ],
    external,
  };
  return [legacy, modern, ssr];
};
