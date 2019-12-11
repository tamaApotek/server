import {
  PhoneNumberUtil,
  PhoneNumberFormat as PNF
} from "google-libphonenumber";

export const isValid = (phoneNumber: string): boolean => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber);
  return phoneUtil.isValidNumber(number);
};

/** format phoneNumber to default `+621234567889` */
export const format = (phoneNumber: string): string => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

  return phoneUtil.format(number, PNF.E164);
};
