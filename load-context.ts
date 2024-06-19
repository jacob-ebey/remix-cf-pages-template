import "@remix-run/cloudflare";

type Cloudflare = {
  ctx: ExecutionContext;
  env: Env;
};

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
