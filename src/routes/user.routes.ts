import { Router, RequestHandler } from "express";

import { UserUsecase } from "../user/usecase";

import { User } from "../model/user";
import { Auth } from "../model/auth";

import { ErrorCode } from "../helper/errors";

import errors from "../constants/error";
import userRole from "../constants/userRole";
import { AuthUsecase } from "../auth/usecase";
import { verifyToken } from "../helper/jwt";

// TODO: Build email validator
const emailValidator = (s: string): boolean => true;

const _makeUser = (user: User): User => {
  if (!user.fullName) {
    throw new ErrorCode(errors.INVALID, "No name provided");
  }
  if (!user.username) {
    throw new ErrorCode(errors.INVALID, "No username provided");
  }
  if (user.email && !emailValidator(user.email)) {
    throw new ErrorCode(errors.INVALID, "Invalid email address");
  }
  if (!Object.values(userRole).includes(user.role)) {
    throw new ErrorCode(errors.INVALID, "Invalid user role");
  }

  return {
    uid: user.uid || "",
    fullName: user.fullName.trim(),
    username: user.username.trim(),
    role: user.role,
    phoneNumber: user.phoneNumber || null,
    email: user.email || null
  };
};

export default function makeUserRouter({
  router = Router(),
  userUsecase,
  authUsecase
}: {
  router?: Router;
  userUsecase: UserUsecase;
  authUsecase: AuthUsecase;
}): Router {
  const register: RequestHandler = async (req, res, next) => {
    let userProfile: User;

    try {
      userProfile = _makeUser(req.body);
    } catch (error) {
      next(error);
      return;
    }
    const userCred: Auth = {
      uid: "",
      email: req.body.email,
      disabled: false,
      phoneNumber: req.body.phoneNumber || "",
      password: req.body.password,
      displayName: userProfile.fullName
    };

    if (!userCred.password) {
      const error = new ErrorCode(errors.INVALID, "Please input password");
      next(error);
      return;
    }

    try {
      await userUsecase.create(userCred, userProfile);
    } catch (error) {
      next(error);
      return;
    }

    res.sendStatus(200);
    return;
  };

  const update: RequestHandler = async (req, res, next) => {
    try {
      switch (req.query.action) {
        case "reset-password":
          await userUsecase.resetPassword(
            res.locals.user.id,
            req.body.password
          );
          res.sendStatus(200);
          return;

        default:
          res.status(400).json({ message: "Invalid action query" });
          return;
      }
    } catch (error) {
      next(error);
    }

    if (!req) {
    }
  };

  router.post("/", register);
  // handled by firebase client sdk
  // router.post("/login", userController.login);

  // from this point onward require authenticated user

  router.use(verifyToken);

  router.put("/user/:id", update);

  return router;
}
