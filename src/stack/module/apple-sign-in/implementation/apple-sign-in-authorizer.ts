import { API } from "../";
import * as Authorizers from "@csbnlu/jawks-authorizers-pulumi/dist/stack/module";
import * as jose from "jose";
import { z } from "zod";

export interface Dependencies {}

export interface Props {
  appClientId: string;
  issuer: string;
  jwksUri: string;
}

export const create: (
  deps: Dependencies,
) => (props: Props) => Authorizers.JWT.API.Authorizer<API.AppleSignInPayload> =
  (deps) => (props) => {
    const { appClientId, issuer, jwksUri } = props;

    return {
      authorize: async ({ token }) => {
        const tokenDefaultClaimsSchema = z.object({
          exp: z.number(),
          iss: z.literal(issuer),
          sub: z.string(),
          aud: z.literal(props.appClientId),
        });

        const payloadSchema = z.object({
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

        try {
          const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

          // 1. Verifiy the token's signature & decode the token
          // const { payload, protectedHeader } = await jose.jwtVerify(identityToken, JWKS, {
          const { payload } = await jose.jwtVerify(token, JWKS, {
            issuer,
            audience: appClientId,
          });

          console.log("✅ Valid signature");

          const defaultClaims = tokenDefaultClaimsSchema.parse(payload);
          const parsedPayload = payloadSchema?.parse(
            payload,
          ) as unknown as API.AppleSignInPayload;

          console.log("✅ Valid token");

          return {
            defaultClaims,
            outcome: "granted",
            payload: parsedPayload,
          };
        } catch (error) {
          return {
            outcome: "denied",
          };
        }
      },
    };
  };
