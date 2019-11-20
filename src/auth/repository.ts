import { Document } from "mongoose";

import { Auth } from "../model/auth";
import { TokenPayload } from "../model/tokenPayload";

import { generateJWTToken, verifyToken } from "../helper/jwt";
import { hashPassword, comparePassword } from "../helper/bcrypt";

export interface AuthRepository {
  /**
   * @return User ID
   */
  registerByUsernameAndPassword(P: {
    username: string;
    password: string;
  }): Promise<string>;
  // /**
  //  * @return User ID
  //  */
  // loginByUsernameAndPassword(P: {
  //   username: string;
  //   password: string;
  // }): Promise<string>;

  findByUsername(username: string): Promise<Auth | null>;

  removeById(id: string): Promise<void>;

  /** generate token using JWT */
  generateToken(payload: TokenPayload): string;

  /** validate JWT Token, throw error if invalid */
  verifyToken(token: string): TokenPayload;

  /** hash password using bcriptjs */
  hashPassword(password: string): string;

  /** verify password using bcriptjs */
  verifyPassword(password: string, hashed: string): boolean;
}

async function makeAuthRepository(
  mongoose: typeof import("mongoose")
): Promise<AuthRepository> {
  // Build Auth Schema
  const authSchema = new mongoose.Schema({
    displayName: { type: String },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phoneNumber: {
      type: String,
      default: null,
      index: true,
      sparse: true,
      unique: true
    },
    providers: [
      {
        name: String,
        email: String
      }
    ]
  });

  authSchema.set("autoIndex", false);

  const AuthModel = mongoose.model<Auth & Document>("Auth", authSchema);

  if (process.env.NODE_ENV !== "production") {
    await AuthModel.ensureIndexes();
  }

  return {
    findByUsername: async username => {
      const userCred = await AuthModel.findOne({ username });
      if (!userCred) {
        return null;
      }

      return Object.freeze<Auth>({
        id: userCred.id,
        displayName: userCred.displayName,
        username: userCred.username,
        password: userCred.password,
        phoneNumber: userCred.phoneNumber,
        providers: userCred.providers
      });
    },

    registerByUsernameAndPassword: async ({ username, password }) => {
      const res = await AuthModel.create({ username, password });
      return res.id;
    },

    removeById: async id => {
      await AuthModel.findByIdAndRemove(id);

      return;
    },

    generateToken: payload => generateJWTToken(payload),

    verifyToken: token => verifyToken(token) as TokenPayload,

    hashPassword: hashPassword,

    verifyPassword: comparePassword
  };
}

export default makeAuthRepository;
