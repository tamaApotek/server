import { User } from "../model/user";
import { DoctorSchedule } from "../model/doctorSchedule";

export interface AppointmentUsecase {
  findAllDoctor(): Promise<User[] | null>;
  findDoctorSchedules(doctorID: string): Promise<DoctorSchedule>;
}
