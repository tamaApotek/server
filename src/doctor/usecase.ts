import { Doctor } from "../model/doctor";
import { DoctorRepository } from "./repository";

export interface DoctorUsecase {
  addDoctor(doctor: Doctor): Promise<string>;
  findByID(doctorID: string): Promise<Doctor | null>;
  findSpecialist(specialistID: string): Promise<Doctor[]>;
}

export default function makeDoctorUsecase({
  doctorRepository
}: {
  doctorRepository: DoctorRepository;
}): DoctorUsecase {
  return {
    addDoctor: async doctor => {
      try {
        const doctorID = await doctorRepository.addDoctor(doctor);
        return doctorID;
      } catch (error) {
        throw error;
      }
    },

    findByID: async doctorID => {
      const doctor = await doctorRepository.findByID(doctorID);
      return doctor;
    },

    findSpecialist: async specialistID => {
      try {
        const doctors = await doctorRepository.findSpecialist(specialistID);
        return doctors;
      } catch (error) {
        throw error;
      }
    }
  };
}
