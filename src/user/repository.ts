import buildMakeUser, { User } from "../model/user";
import { Document, SchemaTypes } from "mongoose";

const makeUser = buildMakeUser({ emailValidator: s => true });

export interface UserRepository {
  createUser(user: User): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
}

async function makeUserRepository(
  mongoose: typeof import("mongoose")
): Promise<UserRepository> {
  const userSchema = new mongoose.Schema(
    {
      id: SchemaTypes.ObjectId,
      fullName: { type: String, required: true },
      username: { type: String, required: true },
      role: {
        type: String,
        enum: ["doctor", "patient", "admin", "superuser"]
      },

      email: { type: String, default: null },
      phoneNumber: { type: String, default: null }
    },
    // turn of id getter
    { id: false }
  );

  userSchema.set("autoIndex", false);

  const UserModel = mongoose.model<User & Document>("User", userSchema);

  if (process.env.NODE_ENV !== "production") {
    await UserModel.ensureIndexes({ role: 1, fullName: "text" });

    // const indexes = await UserProfileModel.listIndexes();
    // console.group("User Profile Indexes");
    // console.log(JSON.stringify(indexes, null, 2));
    // console.groupEnd();
  }

  return {
    createUser: async user => {
      await UserModel.create(user);
      return;
    },

    findByUsername: async username => {
      const res = await UserModel.findOne({ username });
      if (!res) {
        return null;
      }
      res.id;
      const user = makeUser(res);
      return user;
    }
  };
}

export default makeUserRepository;
