export type QueueStatus =
  | "re-register"
  | "waiting"
  | "onprocess"
  | "delayed"
  | "finished"
  | "void";

const queueStatus = Object.freeze({
  /** waiting for patient to re-register at front desk */
  RE_REGISTER: "re-register" as "re-register",
  /** patient has re-registered, waiting for call */
  WAITING: "waiting" as "waiting",
  /** patient is with doctor */
  ON_PROCESS: "onprocess" as "onprocess",
  /** patient has re-registered but late, put into delayed list */
  DELAYED: "delayed" as "delayed",
  /** patient never came */
  FINISHED: "finished" as "finished"
});

export default queueStatus;
