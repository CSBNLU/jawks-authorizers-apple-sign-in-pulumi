import * as aws from "@pulumi/aws";
import { AppleSignIn } from "../../module";
import { AuthorizerArgs } from "@pulumi/aws-apigateway/types/input";
import * as lambdaAuthorizer from "./lambda-authorizer";

export interface Dependencies {
  appleSignInModule: AppleSignIn.API.AppleSignInModule;
}

export interface Props {
  authorizationHeader: string;
  authorizerResultTtlInSeconds: number;
  prefix: string;
}

export const create: (deps: Dependencies) => (props: Props) => AuthorizerArgs =
  (deps) => (props) => ({
    authType: "custom",
    authorizerName: `${props.prefix}-apple-sign-in-authorizer`,
    parameterName: props.authorizationHeader,
    type: "token",
    parameterLocation: "header",
    authorizerResultTtlInSeconds: props.authorizerResultTtlInSeconds,
    handler: new aws.lambda.CallbackFunction(
      `${props.prefix}-apple-sign-in-authorizer`,
      {
        architectures: ["arm64"],
        callback: lambdaAuthorizer.create({
          authorizer: deps.appleSignInModule.authorizer,
        }),
      },
    ),
  });
