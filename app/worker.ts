import { createRequestHandler } from "@remix-run/cloudflare";

// Dynamic import the server build so the worker can start up as quickly as
// possible to start handling requests.
const handler = createRequestHandler(
  // @ts-expect-error - no types
  () => import("virtual:remix/server-build"),
  import.meta.env.MODE
);

export default {
  fetch(request, env, ctx) {
    return handler(request, { cloudflare: { ctx, env } });
  },
} satisfies ExportedHandler<Env>;
