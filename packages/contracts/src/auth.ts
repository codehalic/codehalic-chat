export const AuthRoutes = {
  Challenge: "/auth/challenge" as const,
  Verify: "/auth/verify" as const,
};

export interface AuthChallengeRequest {
  phone: string;
  firstName: string;
  lastName: string;
}

export interface SmsIrResult {
  status: number;
  message: string;
  data?: { messageId: number; cost: number };
}

export interface AuthChallengeResponse {
  ok: boolean;
  expiresIn?: number;
  remain?: number;
  error?: "cooldown" | "service_unavailable" | "invalid_phone";
  sms?: SmsIrResult;
}

export interface AuthVerifyRequest {
  phone: string;
  code: string;
}

export interface UserProfileDTO {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthVerifyResponse {
  ok: boolean;
  token?: string;
  user?: UserProfileDTO;
  error?: "invalid_code";
}
