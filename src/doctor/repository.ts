import { Doctor } from "../model/doctor";
import { Document } from "mongoose";

export interface DoctorRepository {
  /** return doctor-id */
  addDoctor(doctor: Doctor): Promise<string>;
  findAll(): Promise<Doctor[]>;
  findByID(doctorID: string): Promise<Doctor | null>;
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

  await DoctorModel.createIndexes();

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

    findByID: async doctorID => {
      const doctor = await DoctorModel.findById(doctorID);
      if (!doctor) {
        return null;
      }
      return _serializeSingleDoctor(doctor);
    },

    findSpecialist: async specialistID => {
      const res = await DoctorModel.find({ specialistID });

      return res.map(_serializeSingleDoctor);
    }
  };
}
