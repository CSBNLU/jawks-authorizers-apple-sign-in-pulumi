import * as Authorizers from "@csbnlu/jawks-authorizers-pulumi/dist/stack/module";
import { AppleSignInPayload } from "./";

export interface AppleSignInModule {
  appleSignInAuthorizer: Authorizers.JWT.API.Authorizer<AppleSignInPayload>;
}
