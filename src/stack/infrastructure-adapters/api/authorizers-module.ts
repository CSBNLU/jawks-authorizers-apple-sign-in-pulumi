import { AuthorizerArgs } from "@pulumi/aws-apigateway/types/input";

export interface AuthorizersModule {
  appleSignInAuthorizer: AuthorizerArgs;
}
