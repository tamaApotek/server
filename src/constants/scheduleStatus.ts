export type ScheduleStatus = "open" | "close" | "holiday";

const scheduleStatus = Object.freeze({
  OPEN: "open" as "open",
  CLOSE: "close" as "close",
  HOLIDAY: "holiday" as "holiday"
});

export default scheduleStatus;
