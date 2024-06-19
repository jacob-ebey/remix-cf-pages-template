import * as fsp from "node:fs/promises";
import * as path from "node:path";

import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      buildEnd: async (args) => {
        const buildDir = args.remixConfig.buildDirectory;
        await fsp.rename(
          path.join(buildDir, "server"),
          path.join(buildDir, "client/_worker.js")
        );
      },
    }),
    tsconfigPaths(),
    {
      // This plugin runs after everything so we can force configuration
      // overrides after all other plugins.
      name: "force-config",
      config(_, { isSsrBuild }) {
        if (isSsrBuild) {
          return {
            build: {
              rollupOptions: {
                input: "/app/worker.ts",
              },
            },
            ssr: {
              target: "webworker",
              noExternal: true,
              resolve: {
                mainFields: ["module"],
                conditions: ["workerd", "module"],
                externalConditions: ["workerd", "module"],
                noExternal: true,
              },
            },
          };
        }
      },
    },
  ],
});
