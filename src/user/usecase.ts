import { AuthRepository } from "../auth/repository";
import { UserRepository } from "../user/repository";
import { User } from "../model/user";
import { Auth } from "../model/auth";

import { ErrorCode } from "../helper/errors";

import errors from "../constants/error";
import userRole, { UserRole } from "../constants/userRole";
import { DoctorRepository } from "../doctor/repository";
import { Doctor } from "../model/doktor";

export interface UserUsecase {
  create(userCred: Auth, userProfile: User): Promise<void>;

  /** login using username and password */
  login(P: {
    username: string;
    password: string;
  }): Promise<{ profile: User; token: string }>;

  findAllByRole(role: UserRole): Promise<User[]>;
}

export default function makeUserUsecase(repos: {
  authRepository: AuthRepository;
  userRepository: UserRepository;
  doctorRepository: DoctorRepository;
}): UserUsecase {
  const { authRepository, userRepository, doctorRepository } = repos;
  return {
    create: async (userCred, userProfile) => {
      const exists = await authRepository.findByUsername(userCred.username);
      if (exists) {
        const error = new ErrorCode(
          errors.INVALID,
          "User with this username already exists"
        );
        throw error;
      }

      const hashed = authRepository.hashPassword(userCred.password);

      let userID = "";
      try {
        userID = await authRepository.registerByUsernameAndPassword({
          username: userCred.username,
          password: hashed
        });
      } catch (error) {
        console.error(error);
        const err = new ErrorCode(errors.INTERNAL, "Internal serval error");
        throw err;
      }

      userProfile.uid = userID;

      try {
        await userRepository.createUser(userProfile);
      } catch (error) {
        console.error(error);
        await authRepository.removeById(userID);

        const err = new ErrorCode(errors.INTERNAL, "Internal serval error");
        throw err;
      }

      if (userProfile.role === userRole.DOCTOR) {
        try {
          const doctor: Doctor = {
            username: userCred.username,
            uid: userID,
            title: "",
            specialistID: "",
            id: userID,
            fullName: userProfile.fullName
          };
          await doctorRepository.addDoctor(doctor);
        } catch (error) {
          throw error;
        }
      }

      return;
    },

    login: async ({ username, password }) => {
      const auth = await authRepository.findByUsername(username);
      if (!auth) {
        const error = new ErrorCode(
          errors.NOT_FOUND,
          "No user with this username"
        );
        throw error;
      }

      const isMatch = authRepository.verifyPassword(password, auth.password);
      if (!isMatch) {
        const error = new ErrorCode(errors.INVALID, "Wrong password");
        throw error;
      }

      const user = await userRepository.findByUsername(username);
      if (!user) {
        const error = new ErrorCode(errors.NOT_FOUND, "User not found");
        throw error;
      }

      const token = authRepository.generateToken({ id: user.uid });

      return { profile: user, token };
    },

    findAllByRole: async role => {
      const users = await userRepository.findAllByRole(role);
      return users;
    }
  };
}
