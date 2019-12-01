import { DoctorSchedule } from "../model/doctorSchedule";
import { Schedule } from "../model/schedule";
import { Queue } from "../model/queue";
import { DoctorRepository } from "../doctor/repository";
import { ScheduleRepository } from "./repository";
import { Doctor } from "../model/doctor";
import { ErrorCode } from "../helper/errors";
import errors from "../constants/error";

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

export default function makeScheduleUsecase(repos: {
  doctorRepository: DoctorRepository;
  scheduleRepository: ScheduleRepository;
}): ScheduleUsecase {
  const { doctorRepository, scheduleRepository } = repos;
  return {
    findAllDoctorSchedules: async () => {
      let doctors: Doctor[];
      try {
        doctors = await doctorRepository.findAll();
      } catch (error) {
        console.error(error);
        throw new ErrorCode(errors.INTERNAL, "Internal server error");
      }

      if (!doctors) {
        throw new ErrorCode(errors.NOT_FOUND, "No doctor found");
      }

      const scheduleQuery = doctors.map(async doctor => {
        const schedules = await scheduleRepository.findByDoctorID(doctor.id);
        const doctorSchedule: DoctorSchedule = {
          ...doctor,
          schedules
        };
        return doctorSchedule;
      });

      let doctorSchedules: DoctorSchedule[];
      try {
        doctorSchedules = await Promise.all(scheduleQuery);
      } catch (error) {
        console.error(error);
        throw new ErrorCode(errors.INTERNAL, "Internal server error");
      }

      return doctorSchedules;
    },

    findOneDoctorSchedules: async doctorID => {
      let schedules: Schedule[];
      try {
        schedules = await scheduleRepository.findByDoctorID(doctorID);
      } catch (error) {
        console.error(error);
        throw new ErrorCode(errors.INTERNAL, "Internal server error");
      }

      if (!schedules) {
        throw new ErrorCode(errors.NOT_FOUND, "No schedule found");
      }

      return schedules;
    }
  };
}
