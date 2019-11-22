import * as sgMail from "@sendgrid/mail";

const setSendgrid = () => {
  const key = process.env.SENDGRID!;
  sgMail.setApiKey(key);

  return sgMail;
};

export default setSendgrid;
