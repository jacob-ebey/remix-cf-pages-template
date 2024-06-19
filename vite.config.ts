import * as fsp from "node:fs/promises";

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
      async buildEnd() {
        // Move the server build to the client directory under the
        // `_worker` directory for CF Pages deployment.
        await fsp.rename("build/server", "build/client/_worker");
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
          };
        }
      },
    },
  ],
});
