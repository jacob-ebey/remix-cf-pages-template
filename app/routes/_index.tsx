import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export async function loader({
  context: {
    cloudflare: { env },
  },
}: LoaderFunctionArgs) {
  const count = (await env.KV.get<number | null>("home-count", "json")) ?? 0;

  return {
    count,
    message: "Hello from Remix on Cloudflare!",
  };
}

export async function action({
  context: {
    cloudflare: { ctx, env },
  },
}: ActionFunctionArgs) {
  let count = (await env.KV.get<number | null>("home-count", "json")) ?? 0;
  count = count + 1;
  ctx.waitUntil(env.KV.put("home-count", JSON.stringify(count)));

  return { count };
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  const { count, message } = { ...loaderData, ...actionData };

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">{message}</h1>
      <Form method="POST">
        KV Count: {count}{" "}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          increment
        </button>
      </Form>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
      </ul>
    </div>
  );
}
