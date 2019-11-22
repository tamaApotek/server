import { TokenPayload } from "../model/tokenPayload";
import { AuthRepository } from "./repository";
import { verifyToken } from "../helper/jwt";

export interface AuthUsecase {
  verifyToken(token: string): TokenPayload;
}

export default function makeAuthUsecase(repos: {
  authRepository: AuthRepository;
  jwt: typeof import("jsonwebtoken");
  bcript: typeof import("bcryptjs");
}): AuthUsecase {
  const { authRepository, jwt, bcript } = repos;
  return {
    verifyToken: verifyToken
  };
}
