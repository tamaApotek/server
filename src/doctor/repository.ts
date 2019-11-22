import { Doctor } from "../model/doktor";
import { Document } from "mongoose";

export interface DoctorRepository {
  findSpecialist(specialistID: string): Promise<Doctor[]>;
}

const _serializeSingleDoctor = (doctor: Doctor): Doctor => {
  return {
    id: doctor.id,
    uid: doctor.uid || null,
    username: doctor.username || null,
    specialistID: doctor.specialistID,
    fullName: doctor.fullName,
    title: doctor.title
  };
};

export default async function makeDoctorRepository(
  mongoose: typeof import("mongoose")
): Promise<DoctorRepository> {
  const doctorSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, default: null },
    username: { type: mongoose.Schema.Types.ObjectId, default: null },
    specialistID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Specialist",
      index: true
    },
    fullName: { type: String, required: true },
    title: String
  });

  doctorSchema.set("autoIndex", false);

  const DoctorModel = mongoose.model<Doctor & Document>("Doctor", doctorSchema);

  if (process.env.NODE_ENV !== "production") {
    await DoctorModel.ensureIndexes({ role: 1, fullName: "text" });

    // const indexes = await UserProfileModel.listIndexes();
    // console.group("User Profile Indexes");
    // console.log(JSON.stringify(indexes, null, 2));
    // console.groupEnd();
  }

  return {
    findSpecialist: async specialistID => {
      const res = await DoctorModel.find({ specialistID });

      return res.map(_serializeSingleDoctor);
    }
  };
}
