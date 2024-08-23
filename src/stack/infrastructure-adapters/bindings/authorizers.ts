import { API } from "..";
import { AppleSignIn } from "../../module";
import * as Implementation from "../implementation";

export interface Dependencies {
  appleSignInModule: AppleSignIn.API.AppleSignInModule;
}

export interface Props {
  authorizationHeader: string;
  authorizerResultTtlInSeconds: number;
  resourcesPrefix: string;
}

export const create =
  (deps: Dependencies) =>
  (props: Props): API.AuthorizersModule => {
    const { appleSignInModule } = deps;
    const {
      authorizationHeader,
      authorizerResultTtlInSeconds,
      resourcesPrefix,
    } = props;

    const tokenAuthorizerProps = {
      authorizationHeader,
      authorizerResultTtlInSeconds,
      prefix: resourcesPrefix,
    };

    const appleSignInAuthorizer = Implementation.AppleSignInAuthorizer.create({
      appleSignInModule,
    })(tokenAuthorizerProps);

    return {
      appleSignInAuthorizer,
    };
  };
