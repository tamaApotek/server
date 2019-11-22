import { MailData } from "@sendgrid/helpers/classes/mail";

export interface EmailRepository {
  send(msg: MailData): Promise<void>;
}

export default function makeEmailRepository(
  sgMail: typeof import("@sendgrid/mail")
): EmailRepository {
  return {
    send: async msg => {
      await sgMail.send(msg);
      return;
    }
  };
}
