import userRole, { UserRole } from "../constants/userRole";
import { ErrorCode } from "../helper/errors";
import errors from "../constants/error";

/**
 * Any value provided will be sent to end user
 */
export interface User {
  /** user auth id */
  uid: string;
  fullName: string;
  username: string;
  role: UserRole;

  email: string | null;
  phoneNumber: string | null;
}

export default function buildMakeUser(params: {
  emailValidator: (email: string) => boolean;
  userSerializer: (user: User) => User;
}) {
  const { emailValidator, userSerializer } = params;
  return function makeUser(user: User): User {
    if (!user.fullName) {
      throw new ErrorCode(errors.INVALID, "No name provided");
    }
    if (!user.username) {
      throw new ErrorCode(errors.INVALID, "No username provided");
    }
    if (user.email && !emailValidator(user.email)) {
      throw new ErrorCode(errors.INVALID, "Invalid email address");
    }
    if (!Object.values(userRole).includes(user.role)) {
      throw new ErrorCode(errors.INVALID, "Invalid user role");
    }

    return userSerializer(user);
  };
}
