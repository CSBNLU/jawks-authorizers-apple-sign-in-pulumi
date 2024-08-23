import * as InfrastructureAdapters from "./infrastructure-adapters";
import { AppleSignIn } from "./module";

export interface Configuration {
  appClientId: string;
  authorizationHeader?: string;
  authorizerResultTtlInSeconds?: number;
  issuer: string;
  jwksUri: string;
  region: string;
  resourcesPrefix: string;
}

export const compose = (configuration: Configuration) => {
  const { appClientId, issuer, jwksUri, region, resourcesPrefix } =
    configuration;

  const authorizationHeader =
    configuration.authorizationHeader ?? "Authorization";
  const authorizerResultTtlInSeconds =
    configuration.authorizerResultTtlInSeconds ?? 300;

  const appleSignInModuleProps = {
    appClientId,
    issuer,
    jwksUri,
  };

  const appleSignInModule: AppleSignIn.API.AppleSignInModule =
    AppleSignIn.Bindings.create({})(appleSignInModuleProps);

  const infrastructureAdaptersDeps = {
    appleSignInModule,
  };
  const infrastructureAdaptersProps = {
    authorizationHeader,
    authorizerResultTtlInSeconds,
    resourcesPrefix,
  };

  const { appleSignInAuthorizer } =
    InfrastructureAdapters.Bindings.Authorizers.create(
      infrastructureAdaptersDeps,
    )(infrastructureAdaptersProps);

  return {
    appleSignInAuthorizer,
  };
};
