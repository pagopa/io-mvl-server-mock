import * as faker from "faker";
import * as ulid from "ulid";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { LegalMessage } from "../../generated/definitions/LegalMessage";

export const getAttachments = [
  { content_type: "application/pdf", id: "A_PDF_ID", name: "sample.pdf" }
];

export const getMessage = (msgId: NonEmptyString): LegalMessage => ({
  cert_data: {
    data: {
      envelope_id: ulid.ulid() as NonEmptyString,
      msg_id: msgId,
      receipt_type: faker.random.arrayElement(["SENT", "RECEIVED"]),
      sender_provider: faker.random.arrayElement([
        "POSTE",
        "ARUBA",
        "INFOCERT",
        "TIM"
      ]) as NonEmptyString,
      timestamp: faker.date.recent()
    },
    header: {
      object: faker.random.words(3) as NonEmptyString,
      recipients: faker.random.words(3).replace(" ", ";") as NonEmptyString
    }
  },
  eml: {
    attachments: getAttachments,
    html_content: `<p>${faker.random.words(10)}</p>` as NonEmptyString,
    plain_text_content: faker.lorem.lines(5) as NonEmptyString,
    subject: faker.name.title()
  }
});
