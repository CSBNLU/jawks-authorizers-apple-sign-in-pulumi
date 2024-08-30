import { API } from "..";
import { z } from "zod";

export interface RawAppleSignInPayloadSchema {
  email?: string;
  email_verified?: boolean | "true";
  is_private_email?: boolean | "true";
  real_user_status?: number;
  transfer_sub?: string;
}

export type TokenPayloadSchema = z.Schema<
  {
    email?: string;
    email_verified?: boolean;
    is_private_email?: boolean;
    real_user_status?: API.AppleSignInRealUserStatus;
    transfer_sub?: string;
  },
  z.ZodTypeDef,
  RawAppleSignInPayloadSchema
>;
