import "server-only";

import { getAuthEnv } from "@/lib/env.server";

export const OAUTH_STATE_COOKIE = "tgc_oauth_state";
export const OAUTH_RETURN_COOKIE = "tgc_oauth_return";

export interface GitHubUser {
  githubUserId: string;
  githubLogin: string;
}

export const buildAuthorizeUrl = (state: string, redirectUri: string): string => {
  const { GITHUB_CLIENT_ID } = getAuthEnv();
  const url = new URL("https://github.com/login/oauth/authorize");

  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  // No scopes: the default grants public profile data, which is all that is
  // needed to identify the account. Asking for more would be a larger blast
  // radius if the token ever leaked.
  url.searchParams.set("scope", "");
  url.searchParams.set("allow_signup", "false");

  return url.toString();
};

/**
 * Exchanges the authorization code for an access token.
 *
 * The client secret is sent in the POST body over TLS to GitHub and never
 * reaches the browser.
 */
export const exchangeCodeForToken = async (
  code: string,
  redirectUri: string,
): Promise<string> => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = getAuthEnv();

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`);
  }

  const payload: unknown = await response.json();

  // GitHub reports failures with a 200 and an `error` field, so the status
  // alone is not enough to conclude this worked.
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("access_token" in payload) ||
    typeof payload.access_token !== "string"
  ) {
    throw new Error("GitHub token exchange returned no access token");
  }

  return payload.access_token;
};

export const fetchGitHubUser = async (
  accessToken: string,
): Promise<GitHubUser> => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "the-green-closets",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub user lookup failed: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("id" in payload) ||
    !("login" in payload) ||
    typeof payload.login !== "string"
  ) {
    throw new Error("GitHub user lookup returned an unexpected payload");
  }

  return {
    githubUserId: String(payload.id),
    githubLogin: payload.login,
  };
};

/**
 * The authorization decision.
 *
 * Completing the OAuth flow only proves which GitHub account someone controls.
 * Any GitHub user in the world can do that, so identity is not permission —
 * this is what actually decides who gets in.
 *
 * Compared case-insensitively because GitHub logins are case-preserving but
 * not case-sensitive.
 */
export const isAllowedAdmin = (user: GitHubUser): boolean => {
  const { ADMIN_GITHUB_LOGIN } = getAuthEnv();
  return user.githubLogin.toLowerCase() === ADMIN_GITHUB_LOGIN.toLowerCase();
};
