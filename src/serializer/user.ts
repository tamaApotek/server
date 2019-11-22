import { User } from "../model/user";

export default function userSerializer(user: User): User {
  return {
    uid: user.uid || "",
    fullName: user.fullName.trim(),
    username: user.username.trim(),
    role: user.role,
    phoneNumber: user.phoneNumber || null,
    email: user.email || null
  };
}
