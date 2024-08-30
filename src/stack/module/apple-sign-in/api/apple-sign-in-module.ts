import * as Authorizers from "@csbnlu/jawks-authorizers-pulumi/dist/stack/module";
import {
  AppleSignInPayload,
  TokenDefaultClaimsSchema,
  TokenPayloadSchema,
} from "./";

export interface AppleSignInModule {
  authorizer: Authorizers.JWT.API.Authorizer<AppleSignInPayload>;
  tokenDefaultClaimsSchemaFactory: () => TokenDefaultClaimsSchema;
  tokenPayloadSchemaFactory: () => TokenPayloadSchema;
}
