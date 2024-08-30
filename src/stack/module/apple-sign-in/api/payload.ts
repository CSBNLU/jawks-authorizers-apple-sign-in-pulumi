export enum AppleSignInRealUserStatus {
  UNSUPPORTED = 0,
  UNKNOWN = 1,
  LIKELY_REAL = 2,
}

export interface AppleSignInPayload {
  email?: string;
  email_verified: boolean;
  is_private_email: boolean;
  real_user_status: AppleSignInRealUserStatus;
  transfer_sub?: string;
}
