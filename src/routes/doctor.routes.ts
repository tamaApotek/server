import { Router, RequestHandler } from "express";
import { UserUsecase } from "../user/usecase";
import { AuthUsecase } from "../auth/usecase";

import authMiddleware from "../middleware/auth";
import userRole from "../constants/userRole";

const DoctorRouteHandler = ({
  userUsecase,
  authUsecase
}: {
  userUsecase: UserUsecase;
  authUsecase: AuthUsecase;
}) => {
  return {
    verifyToken: async (req, res, next) => {}
  };
};

export default function makeDoctorRouter({
  router = Router(),
  userUsecase,
  authUsecase
}: {
  router?: Router;
  userUsecase: UserUsecase;
  authUsecase: AuthUsecase;
}) {
  const findAllDoctor: RequestHandler = async (req, res, next) => {
    try {
      const doctors = await userUsecase.findAllByRole(userRole.DOCTOR);
      res.status(200).json({ data: doctors });
    } catch (error) {
      next(error);
    }
  };

  router.use(authMiddleware);

  router.get("/", findAllDoctor);

  return router;
}
