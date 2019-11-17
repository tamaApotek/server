import { UserCredential } from "../model/userCredential";
import { Document } from "mongoose";

export interface UserCredentialRepository {
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

  findByUsername(username: string): Promise<UserCredential | null>;

  removeById(id: string): Promise<void>;
}

async function makeUserCredentialRepository(
  mongoose: typeof import("mongoose")
): Promise<UserCredentialRepository> {
  const userCredSchema = new mongoose.Schema({
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

  userCredSchema.set("autoIndex", false);

  const UserCredModel = mongoose.model<UserCredential & Document>(
    "UserCredential",
    userCredSchema
  );

  if (process.env.NODE_ENV !== "production") {
    await UserCredModel.ensureIndexes();
  }

  return {
    findByUsername: async username => {
      const userCred = await UserCredModel.findOne({ username });
      if (!userCred) {
        return null;
      }

      return Object.freeze<UserCredential>({
        id: userCred.id,
        displayName: userCred.displayName,
        username: userCred.username,
        password: userCred.password,
        phoneNumber: userCred.phoneNumber,
        providers: userCred.providers
      });
    },

    registerByUsernameAndPassword: async ({ username, password }) => {
      const res = await UserCredModel.create({ username, password });
      return res.id;
    },

    removeById: async id => {
      await UserCredModel.findByIdAndRemove(id);

      return;
    }
  };
}

export default makeUserCredentialRepository;
