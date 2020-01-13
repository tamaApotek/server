import { AuthRepository } from "../auth/repository";
import { UserRepository } from "../user/repository";
import { User } from "../model/user";
import { Auth } from "../model/auth";

import { ErrorCode } from "../helper/errors";

import errors from "../constants/error";
import userRole, { UserRole } from "../constants/userRole";
import { DoctorRepository } from "../doctor/repository";
import { Doctor } from "../model/doctor";

export interface UserUsecase {
  create(userCred: Auth, userProfile: User): Promise<void>;
  /**
   * Reset user password with a new one. User must be authenticated
   */
  resetPassword(uid: string, newPassword: string): Promise<void>;

  /** login using email with password */
  // handled by firebase client sdk
  // loginWithEmailAndPassword(P: {
  //   email: string;
  //   password: string;
  // }): Promise<{ profile: User; token: string }>;

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
      let exists = await userRepository.findByUsername(userProfile.username);
      if (exists) {
        const error = new ErrorCode(errors.INVALID, "Username already exists");
        throw error;
      }

      let userID = "";
      try {
        userID = await authRepository.create({
          password: userCred.password,
          disabled: false,
          displayName: userCred.displayName,
          phoneNumber: userCred.phoneNumber,
          email: userCred.email
        });
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-exists": {
            const error = new ErrorCode(
              errors.INVALID,
              "User with this email already exists"
            );
            throw error;
          }
          case "auth/phone-number-already-exists": {
            const error = new ErrorCode(
              errors.INVALID,
              "User with this phone number already exists"
            );
            throw error;
          }
          case "auth/invalid-password": {
            const error = new ErrorCode(
              errors.INVALID,
              "Password must be at lease 6 characters"
            );
            throw error;
          }
          default:
            throw error;
        }
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
            username: userProfile.username,
            uid: userID,
            specialistID: "",
            id: userID,
            fullName: userProfile.fullName,
            degrees: []
          };
          await doctorRepository.addDoctor(doctor);
        } catch (error) {
          throw error;
        }
      }

      return;
    },

    resetPassword: async (uid, newPassword) => {
      try {
        await authRepository.resetPassword(uid, newPassword);
      } catch (error) {
        throw error;
      }
    },

    // handled by firebase client sdk
    // loginWithEmailAndPassword: async ({ email, password }) => {

    //   const userCred = await authRepository.(email);
    //   if (!userCred) {
    //     const error = new ErrorCode(
    //       errors.NOT_FOUND,
    //       "No user with this username"
    //     );
    //     throw error;
    //   }

    //   const user = await userRepository.findByUsername(email);
    //   if (!user) {
    //     const error = new ErrorCode(errors.NOT_FOUND, "User not found");
    //     throw error;
    //   }

    //   const token = authRepository.generateToken({ id: user.uid });

    //   return { profile: user, token };
    // },

    findAllByRole: async role => {
      const users = await userRepository.findAllByRole(role);
      return users;
    }
  };
}
