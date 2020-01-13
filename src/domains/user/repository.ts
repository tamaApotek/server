import { Document } from "mongoose";

import { User } from "../../model/user";
import userSerializer from "../../serializer/user";
import { UserRole } from "../../constants/userRole";

export interface UserRepository {
  createUser(user: User): Promise<void>;
  findByUsername(username: string): Promise<User | null>;
  findAllByRole(role: UserRole): Promise<User[]>;
}

async function makeUserRepository(
  mongoose: typeof import("mongoose")
): Promise<UserRepository> {
  const userSchema = new mongoose.Schema(
    {
      uid: mongoose.Schema.Types.ObjectId,
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
      res.uid;
      const user = userSerializer(res);
      return user;
    },

    findAllByRole: async role => {
      const res = await UserModel.find({ role });
      return res.map(userSerializer);
    }
  };
}

export default makeUserRepository;
