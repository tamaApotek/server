import * as jwt from "jsonwebtoken";

const SECRET_JWT = process.env.JWT!;

export interface JWTPayload {
  id: string;
}
function generateJWTToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET_JWT);
}

function verifyToken(token: string) {
  return jwt.verify(token, SECRET_JWT);
}

export default {
  generateJWTToken,
  verifyToken
};
