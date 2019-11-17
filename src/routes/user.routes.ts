import { Router } from "express";

import { UserUsecase } from "../user/usecase";

import makeUserController from "../controller/user.controller";

export default function makeUserRouter({
  router = Router(),
  userUsecase
}: {
  router?: Router;
  userUsecase: UserUsecase;
}): Router {
  const userController = makeUserController({ userUsecase });

  router.post("/login", userController.login);

  return router;
}
