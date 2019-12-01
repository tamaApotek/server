import { Doctor } from "../model/doctor";
import { Document } from "mongoose";

export interface DoctorRepository {
  /** return doctor-id */
  addDoctor(doctor: Doctor): Promise<string>;
  findAll(): Promise<Doctor[]>;
  findSpecialist(specialistID: string): Promise<Doctor[]>;
}

const _serializeSingleDoctor = (doctor: Doctor): Doctor => {
  return {
    id: doctor.id,
    uid: doctor.uid || "",
    username: doctor.username || "",
    specialistID: doctor.specialistID,
    fullName: doctor.fullName,
    degrees: doctor.degrees || []
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
    addDoctor: async (doctor: Doctor) => {
      const res = await DoctorModel.create(doctor);
      return res.id;
    },

    findAll: async () => {
      const doctors = await DoctorModel.find({})
        // for text case insensitive sort
        .collation({ locale: "en" }) // or "id" doesn't matter
        .sort({ fullName: 1 });

      return doctors.map(_serializeSingleDoctor);
    },

    findSpecialist: async specialistID => {
      const res = await DoctorModel.find({ specialistID });

      return res.map(_serializeSingleDoctor);
    }
  };
}
