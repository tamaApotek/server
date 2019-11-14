import { UserRole } from "../constants/userRole";

export interface UserPrivate {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface UserPublic {
  id: string;
  fullName: string;
  role: UserRole;
}

export interface User extends UserPublic, UserPrivate {}
