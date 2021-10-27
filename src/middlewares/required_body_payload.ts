import { FastifyReply, FastifyRequest } from "fastify";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { BadRequestResponse, toBadRequestResponse } from "../utils/response";

export const requiredBodyMiddleware = <S, A>(type: t.Type<A, S>) => (
  request: FastifyRequest,
  _: FastifyReply
): TE.TaskEither<BadRequestResponse, A> =>
  pipe(
    type.decode(request.body),
    TE.fromEither,
    TE.mapLeft(toBadRequestResponse)
  );
