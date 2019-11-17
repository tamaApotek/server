import { RequestHandler } from "express";

import { UserUsecase } from "../user/usecase";

export interface UserController {
  login: RequestHandler;
}

function makeUserController({
  userUsecase
}: {
  userUsecase: UserUsecase;
}): UserController {
  return {
    login: async (req, res, next) => {
      try {
        let token = userUsecase.login({ ...req.body });
        res.status(200).json({ token });
      } catch (error) {
        next(error);
      }
    }
  };
}

export default makeUserController;
