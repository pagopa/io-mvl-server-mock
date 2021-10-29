/* eslint-disable no-console */
import * as fs from "fs";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { getAttachments } from "../utils/mock";

export const readFileAsync = TE.taskify(fs.readFile);

export const getAttachment = (
  attachmentId: NonEmptyString
): TE.TaskEither<Error, O.Option<Buffer>> =>
  pipe(
    getAttachments.find(e => e.id === attachmentId),
    O.fromNullable,
    O.map(
      _ =>
        `${attachmentId}.${_.content_type.substr(
          _.content_type.indexOf("/") + 1
        )}`
    ),
    TE.of,
    TE.chain(
      O.fold(
        () => TE.of(O.none),
        fileName =>
          pipe(
            readFileAsync(`./conf/${fileName}`),
            TE.mapLeft(() => new Error("Cannot retrieve attachment")),
            TE.map(O.some)
          )
      )
    )
  );
