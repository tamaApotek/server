import { User } from "../model/user";

export default function makeUser(user: User): User {
  return {
    id: user.id || "",
    fullName: user.fullName.trim(),
    username: user.username.trim(),
    role: user.role,
    phoneNumber: user.phoneNumber || null,
    email: user.email || null
  };
}
