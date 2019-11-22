import { RequestHandler } from "express";
import { AuthUsecase } from "../auth/usecase";

export interface AuthController {
  verifyToken: RequestHandler;
}

export default function makeAuthController(u: {
  authUsecase: AuthUsecase;
}): AuthController {
  const { authUsecase } = u;
  return {
    verifyToken: (req, res, next) => {
      let token = req.headers.token as string;
      if (!token) {
        res.sendStatus(403);
        return;
      }
      if (token.match(/^bearer/i)) {
        token = token.slice("bearer ".length);
      }
      try {
        const payload = authUsecase.verifyToken(token);
        res.locals.payload = payload;
        next();
      } catch (error) {
        next(error);
      }
    }
  };
}
