import { API } from "..";
import * as Implementation from "../implementation";

// TODO: Move the actual implementation to ../implementation
// TODO: Map between AWS input and output types and the types used in the implementation

export interface Dependencies {}

export interface Props {
  appClientId: string;
  issuer: string;
  jwksUri: string;
}

export const create =
  (deps: Dependencies) =>
  (props: Props): API.AppleSignInModule => {
    const appleSignInAuthorizer = Implementation.AppleSignInAuthorizer.create(
      {},
    )(props);

    return {
      appleSignInAuthorizer,
    };
  };
