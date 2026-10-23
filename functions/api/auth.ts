import {
  getOAuthConfiguration,
  isSecureRequest,
  stateCookie,
  stateTtlSeconds,
  type OAuthEnvironment,
} from "../_lib/oauth";

function errorResponse(message: string, status = 500): Response {
  return new Response(message, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export const onRequestGet = async ({ request, env }: { request: Request; env: OAuthEnvironment }): Promise<Response> => {
  const configuration = getOAuthConfiguration(request, env);
  if (!configuration) return errorResponse("OAuth não está configurado para esta origem.");

  const state = crypto.randomUUID().replaceAll("-", "");
  const authorizationUrl = new URL("https://github.com/login/oauth/authorize");
  authorizationUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", configuration.redirectUri);
  // GitHub OAuth requires `repo` for a private repository. The Decap GitHub
  // backend uses the token in the administrator's browser to create commits.
  authorizationUrl.searchParams.set("scope", "repo");
  authorizationUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString(),
      "Cache-Control": "no-store",
      "Set-Cookie": stateCookie(state, isSecureRequest(request), stateTtlSeconds),
      "X-Content-Type-Options": "nosniff",
    },
  });
};
