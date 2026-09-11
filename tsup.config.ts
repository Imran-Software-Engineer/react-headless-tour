import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Note: tsup's rollup-based `treeshake` option strips module-level
  // directives, which would drop the "use client" banner Next.js needs.
  treeshake: false,
  external: ["react", "react-dom"],
  banner: {
    // Next.js App Router: mark the whole bundle as a client component.
    js: '"use client";',
  },
});
