import { RequestHandler } from "express";

import { generateJWTToken } from "../helper/jwt";
import { comparePassword } from "../helper/bcrypt";

import userMongo from "../user/repository/userMongo";
import makeUserRepository from "../user/repository";

import makeUserUsecase from "../user/usecase";

const userRepository = makeUserRepository(userMongo);

const userUsecase = makeUserUsecase({
  tokenGenerator: generateJWTToken,
  passwordValidator: comparePassword,
  userRepository
});

const login: RequestHandler = async (req, res, next) => {
  try {
    let token = userUsecase.login({ ...req.body });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const UserController = {
  login
};

export default UserController;
