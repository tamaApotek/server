import { TokenPayload } from "../../model/tokenPayload";
import { UserCredentialRepository } from "../../userCredential/repository";
import { UserProfileRepository } from "../../userProfile/repository";
import { UserCredential } from "../../model/userCredential";
import { UserProfile } from "../../model/userProfile";

import { ErrorCode } from "../../helper/errors";

import errors from "../../constants/error";

const registerByUsernameAndPassword = async ({
  userCred,
  userProfile,

  passwordEncriptor,
  tokenGenerator,

  userCredRepository,
  userProfileRepository
}: {
  userCred: UserCredential;
  userProfile: UserProfile;

  passwordEncriptor: (p: string) => string;
  tokenGenerator: (payload: TokenPayload) => string;

  userCredRepository: UserCredentialRepository;
  userProfileRepository: UserProfileRepository;
}) => {
  try {
    const exists = await userCredRepository.findByUsername(userCred.username);
    if (exists) {
      const error = new ErrorCode(errors.INVALID, "Username already used");
      throw error;
    }
  } catch (err) {
    console.error(err);

    const error = new ErrorCode(errors.INTERNAL, "Internal server error");
    throw error;
  }

  let userID = "";
  try {
    const hashed = passwordEncriptor(userCred.password);
    userID = await userCredRepository.registerByUsernameAndPassword({
      username: userCred.username,
      password: hashed
    });
  } catch (err) {
    console.error(err);

    const error = new ErrorCode(errors.INTERNAL, "Internal server error");
    throw error;
  }

  userProfile.id = userID;

  try {
    await userProfileRepository.createUser(userProfile);
  } catch (err) {
    console.error(err);
    await userCredRepository.removeById(userID);

    const error = new ErrorCode(errors.INTERNAL, "Internal server error");
    throw error;
  }

  const token = tokenGenerator({ id: userID });

  return token;
};

export default registerByUsernameAndPassword;
