import { DoctorSchedule } from "../model/doctorSchedule";
import { Schedule } from "../model/schedule";
import { Queue } from "../model/queue";

export interface ScheduleUsecase {
  /** find all schedules of all doctor */
  findAllDoctorSchedules(): Promise<DoctorSchedule[]>;
  /** find schedules of doctor by id */
  findOneDoctorSchedules(doctorID: string): Promise<Schedule[]>;
  /** create schedule and return schedule id */
  createScheduleForDoctor(): Promise<string>;
  /** update one schedule by id */
  updateSchedule(scheduleID: string, schedule: Schedule): Promise<void>;
  /** create queue for schedule with id at date. returns queue id */
  createQueue(P: {
    scheduleID: string;
    date: string;
    queue: Queue;
  }): Promise<string>;
  /** find schedule queue at date */
  findScheduleQueue(P: { scheduleID: string }): Promise<Queue[]>;
}
