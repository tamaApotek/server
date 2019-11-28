import { Router, RequestHandler } from "express";

import { UserUsecase } from "../user/usecase";
import { DoctorUsecase } from "../doctor/usecase";

import { Doctor } from "../model/doctor";

import { verifyToken } from "../helper/jwt";
import { ErrorCode } from "../helper/errors";

import errors from "../constants/error";

const _makeDoctor = (doctor: Doctor): Doctor => {
  if (!doctor.specialistID) {
    throw new ErrorCode(errors.INVALID, "No Specialist provided");
  }
  if (!doctor.fullName) {
    throw new ErrorCode(errors.INVALID, "No Doctor Name Provided");
  }

  return {
    id: doctor.id || "",
    uid: doctor.uid || null,
    username: doctor.username || null,
    specialistID: doctor.specialistID,
    fullName: doctor.fullName.trim(),
    title: (doctor.title || "").trim()
  };
};

export default function makeDoctorRouter({
  router = Router(),
  userUsecase,
  doctorUsecase
}: {
  router?: Router;
  userUsecase: UserUsecase;
  doctorUsecase: DoctorUsecase;
}) {
  const addDoctor: RequestHandler = async (req, res, next) => {
    let doctor: Doctor;
    try {
      doctor = _makeDoctor(req.body);
    } catch (error) {
      next(error);
      return;
    }

    let doctorID = "";
    try {
      doctorID = await doctorUsecase.addDoctor(doctor);
    } catch (error) {
      next(error);
      return;
    }

    res.status(200).json({ doctorID });
    return;
  };

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

  router.use(verifyToken);

  router.post("/", addDoctor);
  router.get("/:specialistID", findSpecialist);

  return router;
}
