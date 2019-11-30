import { TokenPayload } from "../model/tokenPayload";
import { AuthRepository } from "./repository";

export interface AuthUsecase {
  verifyToken(token: string): Promise<TokenPayload>;
}

export default function makeAuthUsecase(repos: {
  authRepository: AuthRepository;
  // jwt: typeof import("jsonwebtoken");
  // bcript: typeof import("bcryptjs");
}): AuthUsecase {
  const { authRepository } = repos;
  return {
    verifyToken: authRepository.verifyToken
  };
}
