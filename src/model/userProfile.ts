import { UserRole } from "../constants/userRole";

/**
 * Any value provided will be sent to end user
 */
export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;

  email: string | null;
  phoneNumber: string | null;
}
