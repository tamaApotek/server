import { DoctorSchedule } from "../../model/doctorSchedule";
import { Schedule } from "../../model/schedule";
import { Queue } from "../../model/queue";
import { DoctorRepository } from "../doctor/repository";
import { ScheduleRepository } from "./repository";
import { Doctor } from "../../model/doctor";
import { ErrorCode } from "../../helper/errors";
import errors from "../../constants/error";

export interface ScheduleUsecase {
  /** find all schedules of all doctor */
  findAllDoctorSchedules(): Promise<DoctorSchedule[]>;
  /** find schedules of doctor by id */
  findOneDoctorSchedules(doctorID: string): Promise<Schedule[]>;
  /** create doctor's schedules and return schedule id */
  createDoctorSchedules(
    doctorID: string,
    schedules: Schedule[]
  ): Promise<Schedule[]>;
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

  const _findOverlapping = (
    existingSchedules: Schedule[],
    incomingSchedules: Schedule[]
  ): Schedule | null => {
    if (!existingSchedules || existingSchedules.length === 0) {
      return null;
    }
    // map schedule for validation
    const scheduleDayMap: { [day: number]: Schedule[] } = {};

    existingSchedules.forEach(sch => {
      if (!scheduleDayMap[sch.dayOfWeek]) {
        scheduleDayMap[sch.dayOfWeek] = [];
      }
      scheduleDayMap[sch.dayOfWeek].push(sch);
    });

    // find overlapping schedule in day
    const doubleEntry = incomingSchedules.find(sch => {
      if (!scheduleDayMap[sch.dayOfWeek]) {
        return false;
      }

      const existingSchDay = scheduleDayMap[sch.dayOfWeek];
      for (const existSch of existingSchDay) {
        // is start time overlapping
        if (
          existSch.startHour <= sch.startHour &&
          sch.startHour <= existSch.endHour
        ) {
          return true;
        }
        // is end time overlapping
        if (
          existSch.startHour <= sch.endHour &&
          sch.endHour <= existSch.endHour
        ) {
          return true;
        }
      }

      return false;
    });

    return doubleEntry || null;
  };

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
    },

    createDoctorSchedules: async (doctorID, schedules) => {
      const existingSchedules = await scheduleRepository.findByDoctorID(
        doctorID
      );

      const overlappingSchedule = _findOverlapping(
        existingSchedules,
        schedules
      );

      if (overlappingSchedule) {
        throw new ErrorCode(errors.CONFLICT, "Overlapping schedule exists");
      }

      try {
        const insertSchedule = await scheduleRepository.createMany(schedules);
        return insertSchedule;
      } catch (error) {
        console.error(error);
        throw new ErrorCode(errors.INTERNAL, "Internal server error");
      }
    },

    updateSchedule: async () => {},

    createQueue: async () => {
      return "";
    },

    findScheduleQueue: async () => {
      return [];
    }
  };
}
