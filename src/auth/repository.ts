import { auth } from "firebase-admin";
import { Auth } from "../model/auth";
import { TokenPayload } from "../model/tokenPayload";

import { hashPassword, comparePassword } from "../helper/bcrypt";

export interface AuthRepository {
  create(userCred: Omit<Auth, "uid">): Promise<string>;
  findById(uid: string): Promise<Auth | null>;

  removeById(id: string): Promise<void>;

  /** generate token using JWT. To be used when user is not from firebase auth */
  generateToken(payload: TokenPayload): Promise<string>;

  /** validate JWT Token from user authenticated from client sdk, throw error if invalid */
  verifyToken(token: string): Promise<TokenPayload>;

  resetPassword(uid: string, newPassword: string): Promise<void>;

  /** hash password using bcriptjs */
  // hashPassword(password: string): string;

  /** verify password using bcriptjs */
  // verifyPassword(password: string, hashed: string): boolean;
}

async function makeAuthRepository(auth: auth.Auth): Promise<AuthRepository> {
  return {
    create: async userCred => {
      const res = await auth.createUser(userCred);

      return res.uid;
    },

    findById: async uid => {
      const userCred = await auth.getUser(uid);
      if (!userCred) {
        return null;
      }

      return {
        uid: userCred.uid,
        displayName: userCred.displayName || "",
        email: userCred.email || "",
        phoneNumber: userCred.phoneNumber || "",
        disabled: userCred.disabled
      };
    },

    removeById: async id => {
      await auth.deleteUser(id);

      return;
    },

    generateToken: async payload => {
      const otherPayload = { ...payload };
      delete otherPayload.id;
      const token = await auth.createCustomToken(payload.id, otherPayload);
      return token;
    },

    verifyToken: async token => {
      const decoded = await auth.verifyIdToken(token);
      return {
        id: decoded.uid
      };
    },

    resetPassword: async (uid, newPassword) => {
      await auth.updateUser(uid, { password: newPassword });
    }

    // hashPassword: hashPassword,

    // verifyPassword: comparePassword
  };
}

export default makeAuthRepository;
