import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import run from "@rollup/plugin-run";
import { wasm } from "@rollup/plugin-wasm";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: ["src/server/index.ts"],
    output: [{ file: "dist/index.js", format: "cjs" }],
    plugins: [
      resolve(),
      typescript({ sourceMap: false, moduleResolution: "node" }),
      !production && run(),
    ],
  },
  {
    input: "src/client/main.ts",
    output: {
      sourcemap: true,
      format: "cjs",
      name: "app",
      dir: "dist/public/build/",
      exports: "auto",
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: "bundle.css" }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      wasm({
        publicPath: "src/common/wasm/pkg/",
        // sync: ["src/common/wasm/pkg/web_tail_wasm_bg.wasm"],
      }),
      // commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      // !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload("dist/public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
