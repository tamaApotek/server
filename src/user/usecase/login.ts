import { UserRepository } from "../repository";
import { User } from "../../model/user";
import { ErrorCode } from "../../helper/errors";

import errors from "../../constants/error";
import { TokenPayload } from "../../model/tokenPayload";

/**
 * User login by username and password
 * May be expanded by other provider
 * @return token
 */
const login = async ({
  username,
  password,

  passwordValidator,
  tokenGenerator,

  userRepository
}: {
  username: string;
  password: string;

  passwordValidator: (p: string, hashed: string) => boolean;
  tokenGenerator: (payload: TokenPayload) => string;

  userRepository: UserRepository;
}) => {
  let user: User | null = null;
  try {
    user = await userRepository.findByUsername(username);
  } catch (error) {
    throw error;
  }

  if (!user) {
    const error = new ErrorCode(errors.NOT_FOUND, "No user with this username");
    throw error;
  }

  const isValid = passwordValidator(password, user.password);

  if (!isValid) {
    const error = new ErrorCode(errors.INVALID, "Wrong password");
    throw error;
  }

  let token: string = "";
  try {
    token = tokenGenerator({ id: user.id });
  } catch (error) {
    throw error;
  }

  return token;
};

export default login;
