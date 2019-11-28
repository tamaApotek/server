import { Doctor } from "./doctor";
import { Schedule } from "./schedule";

export interface DoctorSchedule extends Doctor {
  schedules: Schedule[];
}
