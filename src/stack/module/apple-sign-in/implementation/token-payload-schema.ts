import { API } from "..";
import { z } from "zod";

export const create = (): API.TokenPayloadSchema =>
  z.object({
    email: z.string().email().optional(),
    email_verified: z
      .union([z.boolean(), z.literal("true").transform(() => true)])
      .optional(), // true || 'true', aka an Apple boolean
    is_private_email: z
      .union([z.boolean(), z.literal("true").transform(() => true)])
      .optional(), // true || 'true', aka an Apple boolean
    real_user_status: z
      .number()
      .optional()
      .transform((val) => {
        switch (val) {
          case undefined:
            return undefined;
          case API.AppleSignInRealUserStatus.UNSUPPORTED:
            return API.AppleSignInRealUserStatus.UNSUPPORTED;
          case API.AppleSignInRealUserStatus.UNKNOWN:
            return API.AppleSignInRealUserStatus.UNKNOWN;
          case API.AppleSignInRealUserStatus.LIKELY_REAL:
            return API.AppleSignInRealUserStatus.LIKELY_REAL;
          default:
            console.error(`Unknown real_user_status: ${val}`);
            return API.AppleSignInRealUserStatus.UNKNOWN;
        }
      }),
    transfer_sub: z.string().optional(),
  });
