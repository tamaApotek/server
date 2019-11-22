import { RequestHandler } from "express";

import { UserUsecase } from "../user/usecase";
import makeAuth from "../serializer/auth";
import buildMakeUser, { User } from "../model/user";
import userSerializer from "../serializer/user";
import { Auth } from "../model/auth";
import { ErrorCode } from "../helper/errors";
import errors from "../constants/error";
import userRole from "../constants/userRole";

const makeUser = buildMakeUser({
  emailValidator: s => true,
  userSerializer: userSerializer
});

export interface UserController {
  /** register with username and password */
  register: RequestHandler;
  /** login with username and password */
  login: RequestHandler;

  findAllDoctors: RequestHandler;
}

function makeUserController({
  userUsecase
}: {
  userUsecase: UserUsecase;
}): UserController {
  return {
    register: async (req, res, next) => {
      let userProfile: User;

      try {
        userProfile = makeUser(req.body);
      } catch (error) {
        next(error);
        return;
      }
      const userCred: Auth = {
        id: "",
        username: userProfile.username,
        phoneNumber: req.body.phoneNumber || null,
        password: req.body.password,
        fullName: userProfile.fullName,
        providers: []
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
    },

    login: async (req, res, next) => {
      try {
        let token = userUsecase.login({ ...req.body });
        res.status(200).json({ token });
      } catch (error) {
        next(error);
        return;
      }
    },

    findAllDoctors: async (req, res, next) => {
      try {
        const doctors = await userUsecase.findAllByRole(userRole.DOCTOR);
        res.status(200).json({ doctors });
      } catch (error) {
        next(error);
      }
    }
  };
}

export default makeUserController;
