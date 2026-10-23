export interface OAuthEnvironment {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET?: string;
  OAUTH_ALLOWED_ORIGIN: string;
  OAUTH_REDIRECT_URI: string;
}

export interface OAuthConfiguration {
  allowedOrigin: string;
  redirectUri: string;
}

export const stateCookieName = "__Host-enzo_oauth_state";
export const stateTtlSeconds = 600;

/** Validates the values that bind OAuth to the deployed Pages origin. */
export function getOAuthConfiguration(request: Request, env: OAuthEnvironment): OAuthConfiguration | null {
  if (!env.GITHUB_CLIENT_ID || !env.OAUTH_ALLOWED_ORIGIN || !env.OAUTH_REDIRECT_URI) return null;

  try {
    const requestOrigin = new URL(request.url).origin;
    const allowedOrigin = new URL(env.OAUTH_ALLOWED_ORIGIN).origin;
    const redirectUrl = new URL(env.OAUTH_REDIRECT_URI);

    if (requestOrigin !== allowedOrigin || redirectUrl.origin !== allowedOrigin || redirectUrl.pathname !== "/api/callback" || redirectUrl.search || redirectUrl.hash) return null;
    return { allowedOrigin, redirectUri: redirectUrl.toString() };
  } catch {
    return null;
  }
}

export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

export function getCookie(request: Request, name: string): string | undefined {
  const value = request.headers.get("Cookie") ?? "";
  return value.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

/** Constant-time equality avoids leaking partial state values through timing. */
export function sameValue(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

export function stateCookieNameForRequest(secure: boolean): string {
  return secure ? stateCookieName : stateCookieName.replace("__Host-", "");
}

export function stateCookie(state: string, secure: boolean, maxAge: number): string {
  const name = stateCookieNameForRequest(secure);
  return `${name}=${state}; HttpOnly;${secure ? " Secure;" : ""} SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}
