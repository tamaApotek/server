import { Router } from "express";

const router = Router();

const patient = require("./patient");
const dokter = require("./dokter");
const queue = require("./queue");

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "connected" });
});

router.use("/patients", patient);
router.use("/dokters", dokter);
router.use("/queue", queue);

export default router;
