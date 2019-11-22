import { Auth } from "../model/auth";

export default function makeAuth(auth: Auth): Auth {
  return {
    id: auth.id || "",
    fullName: auth.fullName.trim(),
    username: auth.username.trim(),
    password: auth.password,
    phoneNumber: auth.phoneNumber || null,
    providers: auth.providers || []
  };
}
