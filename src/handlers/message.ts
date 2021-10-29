import { IncomingMessage, Server, ServerResponse } from "http";
import { FastifyReply, FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { identity, pipe } from "fp-ts/lib/function";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { getMessage } from "../utils/mock";
import { LegalMessage } from "../../generated/definitions/LegalMessage";
import { getAttachment } from "../services/attachment";
import {
  toFastifyReply,
  toInternalServerError,
  toNotFoundResponse
} from "../utils/response";

export const getLegalMessageHandler = () => async (
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
    LegalMessage
  >
): Promise<FastifyReply> =>
  pipe(
    TE.of(
      reply.code(200).send(getMessage(request.params.id as NonEmptyString))
    ),
    TE.toUnion
  )();

export const getLegalMessageFormatHandler = () => async (
  request: FastifyRequest<
    {
      readonly Params: {
        readonly id: string;
        readonly format: "eml" | "smime" | "daticert";
      };
    },
    Server,
    IncomingMessage
  >,
  reply: FastifyReply<
    Server,
    IncomingMessage,
    ServerResponse,
    RouteGenericInterface,
    string
  >
): Promise<FastifyReply> =>
  pipe(
    request.params.format,
    O.fromNullable,
    O.fold(() => "Test legal message format", identity),
    TE.of,
    TE.map(_ => reply.code(200).send(_)),
    TE.toUnion
  )();

export const getLegalMessageAttachmentHandler = () => async (
  request: FastifyRequest<
    {
      readonly Params: {
        readonly id: string;
        readonly attachment_id: NonEmptyString;
      };
    },
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
): Promise<FastifyReply> =>
  pipe(
    getAttachment(request.params.attachment_id),
    TE.mapLeft(toInternalServerError),
    TE.chainW(TE.fromOption(() => toNotFoundResponse("Attachment Not Found"))),
    TE.mapLeft(toFastifyReply(reply)),
    TE.map(_ =>
      reply
        .code(200)
        .type("application/octet-stream")
        .send(_)
    ),
    TE.toUnion
  )();
