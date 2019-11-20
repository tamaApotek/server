export type QueueStatus = "waiting" | "onprocess" | "delayed" | "finished";

const queueStatus = Object.freeze({
  WAITING: "waiting" as "waiting",
  ON_PROCESS: "onprocess" as "onprocess",
  DELAYED: "delayed" as "delayed",
  FINISHED: "finished" as "finished"
});

export default queueStatus;
