import { UserRepository } from "./repository";

import login from "./usecase/login";
import { TokenPayload } from "../model/tokenPayload";

type passwordValidator = (password: string, hashed: string) => boolean;

export interface UserUsecase {
  login(P: { username: string; password: string }): Promise<string>;
}

const makeUserUsecase = (r: {
  passwordValidator: passwordValidator;
  tokenGenerator: (payload: TokenPayload) => string;
  userRepository: UserRepository;
}) => {
  return Object.freeze<UserUsecase>({
    login: p => login({ ...p, ...r })
  });
};

export default makeUserUsecase;
