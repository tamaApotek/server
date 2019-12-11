import { Router, RequestHandler } from "express";

import { UserUsecase } from "../user/usecase";
import { AuthUsecase } from "../auth/usecase";

import { User } from "../model/user";
import { Auth } from "../model/auth";

import errors from "../constants/error";
import userRole from "../constants/userRole";

import { ErrorCode } from "../helper/errors";
import * as phoneHelper from "../helper/phoneNumber";

import auth from "../middleware/auth";

// TODO: Build email validator
const emailValidator = (s: string): boolean => true;

const _makeUser = (user: User): User => {
  if (!user.fullName) {
    throw new ErrorCode(errors.INVALID, "No name provided");
  }
  // TODO: Disable if not used
  if (!user.username) {
    throw new ErrorCode(errors.INVALID, "No username provided");
  }
  if (!Object.values(userRole).includes(user.role)) {
    throw new ErrorCode(errors.INVALID, "Invalid user role");
  }

  let _email = "";

  if (user.email) {
    if (!emailValidator(user.email)) {
      throw new ErrorCode(errors.INVALID, "Invalid email address");
    }
    _email = user.email.toLowerCase().trim();
  }

  let _phoneNumber = "";
  if (user.phoneNumber) {
    if (!phoneHelper.isValid(user.phoneNumber)) {
      throw new ErrorCode(errors.INVALID, "Invalid phone number");
    }
    _phoneNumber = phoneHelper.format(user.phoneNumber);
  }

  return {
    uid: user.uid || "",
    fullName: user.fullName.trim(),
    username: user.username.trim(),
    role: user.role,
    phoneNumber: _phoneNumber,
    email: _email
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
      email: userProfile.email || "",
      phoneNumber: userProfile.phoneNumber || "",
      password: req.body.password,
      displayName: userProfile.fullName,
      disabled: false
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
  };

  router.post("/", register);
  // handled by firebase client sdk
  // router.post("/login", userController.login);

  // from this point onward require authenticated user

  router.use(auth);

  router.put("/:id", update);

  return router;
}
