import * as jwt from "jsonwebtoken";
import { TokenPayload } from "../model/tokenPayload";

const SECRET_JWT = process.env.JWT!;

export function generateJWTToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET_JWT);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET_JWT) as TokenPayload;
}

export default {
  generateJWTToken,
  verifyToken
};
