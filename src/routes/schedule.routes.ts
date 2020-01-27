import { Router, RequestHandler } from "express";
import { DoctorUsecase } from "../domains/doctor/usecase";
import { ScheduleUsecase } from "../domains/schedule/usecase";
import { AuthUsecase } from "../domains/auth/usecase";
import { Schedule } from "../model/schedule";
import { ErrorCode } from "../helper/errors";
import errors from "../constants/error";
import scheduleStatus from "../constants/scheduleStatus";
import { Doctor } from "../model/doctor";

const _makeSchedule = (schedule: Schedule): Schedule => {
  if (!schedule.doctorID) {
    throw new ErrorCode(errors.INVALID, "Invalid doctor id");
  }
  if (!schedule.dayOfWeek || schedule.dayOfWeek < 1 || schedule.dayOfWeek > 7) {
    throw new ErrorCode(errors.INVALID, "Invalid day of week");
  }
  if (schedule.startHour < 0 || schedule.startHour > 23) {
    throw new ErrorCode(errors.INVALID, "Invalid time");
  }
  if (schedule.startMinute < 0 || schedule.startMinute > 59) {
    throw new ErrorCode(errors.INVALID, "Invalid time");
  }
  if (schedule.endHour < 0 || schedule.endHour > 23) {
    throw new ErrorCode(errors.INVALID, "Invalid time");
  }
  if (schedule.endMinute < 0 || schedule.endMinute > 59) {
    throw new ErrorCode(errors.INVALID, "Invalid time");
  }
  if (schedule.limit < 0) {
    throw new ErrorCode(errors.INVALID, "Invalid limit");
  }
  if (!Object.values(scheduleStatus).includes(schedule.status)) {
    throw new ErrorCode(errors.INVALID, "Invalid status");
  }

  return {
    id: schedule.id || "",
    doctorID: schedule.doctorID,
    dayOfWeek: schedule.dayOfWeek,
    startHour: schedule.startHour,
    startMinute: schedule.startMinute,
    endHour: schedule.endHour,
    endMinute: schedule.endMinute,
    limit: schedule.limit,
    status: schedule.status
  };
};

export default function makeScheduleRouter({
  router = Router(),
  doctorUsecase,
  scheduleUsecase,
  authUsecase
}: {
  router?: Router;
  doctorUsecase: DoctorUsecase;
  scheduleUsecase: ScheduleUsecase;
  authUsecase: AuthUsecase;
}) {
  const findAllDoctorSchedules: RequestHandler = async (req, res, next) => {
    try {
      const schedules = await scheduleUsecase.findAllDoctorSchedules();

      res.status(200).json({ data: schedules });
    } catch (error) {
      next(error);
    }
  };

  const createScheduleForDoctor: RequestHandler = async (req, res, next) => {
    const doctorID = req.params.id;

    let doctor: Doctor | null;
    try {
      doctor = await doctorUsecase.findByID(doctorID);
    } catch (error) {
      next(error);
      return;
    }

    if (!doctor) {
      res.status(204).json({ message: "Doctor not found" });
      return;
    }

    if (!req.body.schedules || !Array.isArray(req.body.schedules)) {
      res.status(400).json({ message: "Invalid schedules" });
      return;
    }

    let schedules: Schedule[];
    try {
      schedules = req.body.schedules.map((el: Schedule) => {
        const sch = _makeSchedule(el);
        sch.doctorID = doctorID;
      });
    } catch (error) {
      next(error);
      return;
    }

    try {
      schedules = await scheduleUsecase.createDoctorSchedules(
        doctorID,
        schedules
      );

      res.status(200).json({ data: schedules });
      return;
    } catch (error) {
      next(error);
      return;
    }
  };

  router.use(authUsecase.verifyToken);

  router.post("/");
  router.get("/", findAllDoctorSchedules);

  router.post("/doctors/:id", createScheduleForDoctor);
  router.get("/doctors", findAllDoctorSchedules);
}
