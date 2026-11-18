import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { authenticateCloudflareRequest } from "../lib/cloudflare-access";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    if (env.FIELDWORK_HOST === "cloudflare") {
      const verified = await authenticateCloudflareRequest(request, env.FIELDWORK_ACCESS_TEAM_DOMAIN, env.FIELDWORK_ACCESS_AUD);
      if (!verified) return new Response("Sign in through Cloudflare Access to open Fieldwork.", { status: 401 });
      request = verified;
      const url = new URL(request.url);
      if (url.pathname === "/signin-with-chatgpt") return Response.redirect(new URL("/", url), 302);
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};

export default worker;
