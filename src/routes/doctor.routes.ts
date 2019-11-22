import { Router, RequestHandler } from "express";
import { UserUsecase } from "../user/usecase";
import { DoctorUsecase } from "../doctor/usecase";

import authMiddleware from "../middleware/auth";
import userRole from "../constants/userRole";

export default function makeDoctorRouter({
  router = Router(),
  userUsecase,
  doctorUsecase
}: {
  router?: Router;
  userUsecase: UserUsecase;
  doctorUsecase: DoctorUsecase;
}) {
  const findSpecialist: RequestHandler = async (req, res, next) => {
    try {
      const specialistID = req.params.specialistID;
      const doctors = await doctorUsecase.findSpecialist(specialistID);
      if (doctors.length === 0) {
        res.sendStatus(204);
        return;
      }
      res.status(200).json({ data: doctors });
    } catch (error) {
      next(error);
    }
  };

  router.use(authMiddleware);

  router.get("/:specialistID", findSpecialist);

  return router;
}
