import { TokenPayload } from "../model/tokenPayload";

import { UserCredentialRepository } from "../userCredential/repository";
import { UserProfileRepository } from "../userProfile/repository";

import { UserCredential } from "../model/userCredential";
import { UserProfile } from "../model/userProfile";

import login from "./usecase/login";
import registerByUsernameAndPassword from "./usecase/registerByUsernameAndPassword";

type passwordValidator = (password: string, hashed: string) => boolean;
type passwordEncriptor = (password: string) => string;

export interface UserUsecase {
  /**
   * @return token
   */
  login(P: { username: string; password: string }): Promise<string>;
  /**
   * Register new user with username and password
   * If successful send token to user
   *
   * @return User ID
   */
  registerByUsernameAndPassword(P: {
    userCred: UserCredential;
    userProfile: UserProfile;
  }): Promise<string>;
}

const makeUserUsecase = (r: {
  passwordValidator: passwordValidator;
  passwordEncriptor: passwordEncriptor;

  tokenGenerator: (payload: TokenPayload) => string;

  userCredRepository: UserCredentialRepository;
  userProfileRepository: UserProfileRepository;
}) => {
  return Object.freeze<UserUsecase>({
    login: p => login({ ...p, ...r }),
    registerByUsernameAndPassword: p =>
      registerByUsernameAndPassword({ ...p, ...r })
  });
};

export default makeUserUsecase;
