import { Router, RequestHandler } from "express";
import { DoctorUsecase } from "../doctor/usecase";
import { ScheduleUsecase } from "../schedule/usecase";
import { AuthUsecase } from "../auth/usecase";

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

  router.use(authUsecase.verifyToken);

  router.get("/doctors", findAllDoctorSchedules);
}
