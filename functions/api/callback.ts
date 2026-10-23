import {
  getCookie,
  getOAuthConfiguration,
  isSecureRequest,
  sameValue,
  stateCookie,
  stateCookieNameForRequest,
  type OAuthEnvironment,
} from "../_lib/oauth";

function callbackPage(origin: string, status: "success" | "error", payload: Record<string, string>, secureCookie: boolean): Response {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const jsonForScript = (value: string) => JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  const body = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>Autorizando…</title></head><body><p id="status">Autorizando…</p><script>const origin=${jsonForScript(origin)};const result=${jsonForScript(message)};const status=document.getElementById("status");if(!window.opener){status.textContent="Janela de origem não encontrada.";}else{window.opener.postMessage("authorizing:github",origin);window.addEventListener("message",(event)=>{if(event.origin!==origin||event.data!=="authorizing:github")return;window.opener.postMessage(result,origin);status.textContent="Autorização concluída. Esta janela pode ser fechada.";window.close();},{once:true});}</script></body></html>`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Set-Cookie": stateCookie("", secureCookie, 0),
    },
  });
}

export const onRequestGet = async ({ request, env }: { request: Request; env: OAuthEnvironment }): Promise<Response> => {
  const url = new URL(request.url);
  const secureCookie = isSecureRequest(request);
  const configuration = getOAuthConfiguration(request, env);

  if (!configuration || !env.GITHUB_CLIENT_SECRET) {
    return new Response("OAuth não está configurado para esta origem.", {
      status: 500,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }

  const requestedState = url.searchParams.get("state");
  const cookieState = getCookie(request, stateCookieNameForRequest(secureCookie));
  if (!requestedState || !cookieState || !sameValue(requestedState, cookieState)) {
    return callbackPage(configuration.allowedOrigin, "error", { error: "OAuth state inválido ou expirado." }, secureCookie);
  }

  const providerError = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (providerError || !code) {
    return callbackPage(configuration.allowedOrigin, "error", { error: providerError ? "Autorização recusada no GitHub." : "Código de autorização ausente." }, secureCookie);
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: configuration.redirectUri,
        state: requestedState,
      }),
    });
  } catch {
    return callbackPage(configuration.allowedOrigin, "error", { error: "Não foi possível contactar o GitHub." }, secureCookie);
  }

  if (!tokenResponse.ok) return callbackPage(configuration.allowedOrigin, "error", { error: "Falha ao trocar o código OAuth." }, secureCookie);

  let tokenPayload: { access_token?: string; error?: string; error_description?: string };
  try {
    tokenPayload = (await tokenResponse.json()) as { access_token?: string; error?: string; error_description?: string };
  } catch {
    return callbackPage(configuration.allowedOrigin, "error", { error: "Resposta inválida do GitHub." }, secureCookie);
  }

  if (!tokenPayload.access_token) {
    return callbackPage(configuration.allowedOrigin, "error", { error: "Token não recebido do GitHub." }, secureCookie);
  }

  return callbackPage(configuration.allowedOrigin, "success", { token: tokenPayload.access_token }, secureCookie);
};
