import { Doctor } from "../model/doktor";
import { DoctorRepository } from "./repository";

export interface DoctorUsecase {
  findSpecialist(specialistID: string): Promise<Doctor[]>;
}

export default function makeDoctorUsecase({
  doctorRepository
}: {
  doctorRepository: DoctorRepository;
}) {
  return {
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
