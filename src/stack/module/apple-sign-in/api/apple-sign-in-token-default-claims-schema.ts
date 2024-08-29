import { z } from "zod";

export const create = (props: { appClientId: string; issuer: string }) =>
  z.object({
    exp: z.number(),
    iss: z.literal(props.issuer),
    sub: z.string(),
    aud: z.literal(props.appClientId),
  });
