import {
  AuthRoutes,
  type AuthChallengeRequest,
  type AuthChallengeResponse,
  type AuthVerifyRequest,
  type AuthVerifyResponse,
} from "@repo/contracts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function postJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(API_BASE + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`http_${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  challenge: (req: AuthChallengeRequest) =>
    postJson<AuthChallengeResponse>(AuthRoutes.Challenge, req),
  verify: (req: AuthVerifyRequest) =>
    postJson<AuthVerifyResponse>(AuthRoutes.Verify, req),
};
