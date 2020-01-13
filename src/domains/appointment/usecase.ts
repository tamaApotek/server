import { User } from "../../model/user";
import { Schedule } from "../../model/schedule";

export interface AppointmentUsecase {
  findAllDoctor(): Promise<User[] | null>;
  findDoctorSchedules(doctorID: string): Promise<Schedule>;
}
