import mongoose, { Schema, Types, Document } from "mongoose";
import { User } from "../../model/user";

const userSchema = new Schema({
  fullName: { type: String, indexes: ["text", 1] },
  username: { type: String, indexes: ["text", 1] },
  password: String
});

userSchema.set("autoIndex", false);
userSchema.index({ fullName: "text" });

const UserModel = mongoose.model<User & Document>("User", userSchema);

if (process.env.NODE_ENV !== "production") {
  UserModel.ensureIndexes(err => {
    if (err) {
      console.error(err);
    } else {
      console.log("User indexing completed");
    }
  });
}

const findById = async (id: string): Promise<User | null> => {
  const res = await UserModel.findById(id);

  if (!res) {
    return null;
  }

  return Object.freeze<User>({
    id: res.id,
    fullName: res.fullName,
    username: res.username,
    email: res.email || "",
    phoneNumber: res.phoneNumber || ""
  });
};

export default {
  findById
};
