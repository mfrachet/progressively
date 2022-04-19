import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const external = ["react"];

export default () => {
  const legacy = {
    input: "src/index.ts",
    output: {
      dir: "lib/legacy",
      format: "cjs",
    },
    plugins: [typescript({ outDir: "lib/legacy", target: "es5" }), terser()],
    external,
  };

  const modern = {
    input: "src/index.ts",
    output: {
      dir: "lib/modern",
      format: "cjs",
    },
    plugins: [typescript({ outDir: "lib/modern", target: "ESNext" }), terser()],
    external,
  };
  return [legacy, modern];
};
