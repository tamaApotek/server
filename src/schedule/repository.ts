import { Schedule } from "../model/schedule";

export interface ScheduleRepository {
  findByDoctorID(doctorID: string): Promise<Schedule[]>;
}
