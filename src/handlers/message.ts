import { IncomingMessage, Server, ServerResponse } from "http";
import { FastifyReply, FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

export const getLegalMessageHandler = () => async (
  // eslint-disable-next-line @typescript-eslint/ban-types
  request: FastifyRequest<
    { readonly Params: { readonly id: string } },
    Server,
    IncomingMessage
  >,
  reply: FastifyReply<
    Server,
    IncomingMessage,
    ServerResponse,
    RouteGenericInterface,
    unknown
  >
): Promise<FastifyReply> => {
  // eslint-disable-next-line no-console
  console.log(request.params);
  return pipe(
    TE.of(reply.code(200).send(`OK ${request.params.id}`)),
    TE.toUnion
  )();
};
