import { TokenPayload } from "../../model/tokenPayload";
import { UserCredentialRepository } from "../../userCredential/repository";
import { UserCredential } from "../../model/userCredential";

import { ErrorCode } from "../../helper/errors";

import errors from "../../constants/error";

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

  userCredRepository
}: {
  username: string;
  password: string;

  passwordValidator: (p: string, hashed: string) => boolean;
  tokenGenerator: (payload: TokenPayload) => string;

  userCredRepository: UserCredentialRepository;
}) => {
  let user: UserCredential | null = null;
  try {
    user = await userCredRepository.findByUsername(username);
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
