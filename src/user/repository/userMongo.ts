import mongoose, { Schema, Document } from "mongoose";

import { User } from "../../model/userProfile";
import { UserRepository } from "../repository";

const userSchema = new Schema({
  fullName: { type: String, indexes: ["text", 1] },
  username: { type: String, indexes: ["text", 1] },
  password: String
});

userSchema.set("autoIndex", false);

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

const _serializeSingleUser = (user: User & Document): User => {
  return Object.freeze<User>({
    id: user.id || user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    role: user.role,
    password: user.password
  });
};

function _serializeUser(P: User & Document): User;
function _serializeUser(P: (User & Document)[]): User[];
function _serializeUser(data: any): any {
  if (Array.isArray(data)) {
    return data.map(_serializeSingleUser);
  }
  return _serializeSingleUser(data);
}

const findById: UserRepository["findById"] = async id => {
  const res = await UserModel.findById(id);

  if (!res) {
    return null;
  }

  return _serializeUser(res);
};

const findByUsername: UserRepository["findByUsername"] = async username => {
  const res = await UserModel.findOne({ username });

  if (!res) {
    return null;
  }

  return _serializeUser(res);
};

export default Object.freeze<UserRepository>({
  findById,
  findByUsername
});
