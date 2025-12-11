import { create } from "zustand";
import type {
  UserProfileDTO,
  AuthVerifyRequest,
  AuthChallengeRequest,
} from "@repo/contracts";
import { api } from "../lib/api";

type AuthState = {
  user?: UserProfileDTO;
  token?: string;
  status: "anonymous" | "verifying" | "authenticated";
  challenge: (
    payload: AuthChallengeRequest
  ) => Promise<import("@repo/contracts").AuthChallengeResponse>;
  verify: (payload: AuthVerifyRequest) => Promise<boolean>;
  logout: () => void;
};

function normalizeIranPhone(input: string): string {
  let digits = String(input || "").replace(/\D/g, "");
  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^9\d{9}$/.test(digits)) throw new Error("invalid_iran_phone");
  return `+98${digits}`;
}

export const useAuth = create<AuthState>()((set) => ({
  status: "anonymous",
  challenge: async (payload) => {
    try {
      const phone = normalizeIranPhone(payload.phone);
      const res = await api.challenge({ ...payload, phone });
      if (res.ok) {
        set({ status: "verifying" });
      } else {
        set({ status: "anonymous" });
      }
      return res as any;
    } catch {
      set({ status: "anonymous" });
      return false;
    }
  },
  verify: async (payload) => {
    try {
      const phone = normalizeIranPhone(payload.phone);
      const res = await api.verify({ ...payload, phone });
      if (res.ok && res.token && res.user) {
        set({ token: res.token, user: res.user, status: "authenticated" });
        return true;
      }
      set({ status: "anonymous" });
      return false;
    } catch {
      set({ status: "anonymous" });
      return false;
    }
  },
  logout: () => set({ token: undefined, user: undefined, status: "anonymous" }),
}));
