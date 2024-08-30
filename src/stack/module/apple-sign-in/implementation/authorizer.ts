import { API } from "..";
import * as Authorizers from "@csbnlu/jawks-authorizers-pulumi/dist/stack/module";
import * as jose from "jose";

export interface Dependencies {
  tokenPayloadSchemaFactory: () => API.TokenPayloadSchema;
  tokenDefaultClaimsSchemaFactory: () => API.TokenDefaultClaimsSchema;
}

export interface Props {
  appClientId: string;
  issuer: string;
  jwksUri: string;
}

export const create: (
  deps: Dependencies,
) => (props: Props) => Authorizers.JWT.API.Authorizer<API.AppleSignInPayload> =
  (deps) => (props) => {
    const { tokenPayloadSchemaFactory, tokenDefaultClaimsSchemaFactory } = deps;
    const { appClientId, issuer, jwksUri } = props;

    return {
      authorize: async ({ token }) => {
        const payloadSchema = tokenPayloadSchemaFactory();
        const tokenDefaultClaimsSchema = tokenDefaultClaimsSchemaFactory();

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
          const parsedPayload = payloadSchema.parse(
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
