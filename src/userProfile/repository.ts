import { UserProfile } from "../model/userProfile";
import { Document } from "mongoose";

export interface UserProfileRepository {
  createUser(user: UserProfile): Promise<void>;
}

async function makeUserProfileRepository(
  mongoose: typeof import("mongoose")
): Promise<UserProfileRepository> {
  const userProfileSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    role: {
      type: String,
      enum: ["doctor", "patient", "admin", "superuser"]
    },

    email: { type: String, default: null },
    phoneNumber: { type: String, default: null }
  });

  userProfileSchema.set("autoIndex", false);

  const UserProfileModel = mongoose.model<UserProfile & Document>(
    "UserProfile",
    userProfileSchema
  );

  if (process.env.NODE_ENV !== "production") {
    await UserProfileModel.ensureIndexes({ role: 1, fullName: "text" });

    // const indexes = await UserProfileModel.listIndexes();
    // console.group("User Profile Indexes");
    // console.log(JSON.stringify(indexes, null, 2));
    // console.groupEnd();
  }

  return {
    createUser: async user => {
      const { id } = user;

      const saveUser = { ...user, _id: new mongoose.SchemaTypes.ObjectId(id) };

      await UserProfileModel.create(saveUser);
    }
  };
}

export default makeUserProfileRepository;
