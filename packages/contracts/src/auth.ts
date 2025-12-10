export const AuthRoutes = {
  Challenge: '/auth/challenge' as const,
  Verify: '/auth/verify' as const,
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
  otpPreview?: string;
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
  error?: 'invalid_code';
}

