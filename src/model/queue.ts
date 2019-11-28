import { QueueStatus } from "../constants/queueStatus";

/**
 * Queue represent each day patient queue.
 * must be able to combine manual input queue and app input queue
 */
export interface Queue {
  /** YYYY-MM-DD */
  date: string;
  scheduleID: string;
  doctorID: string;
  patientID: string;
  patientName: string;
  status: QueueStatus;
  createdAt: Date;
  validatedAt: Date | null; // re-register timestamp
  startAt: Date | null; // called by doctor timestamp
  endAt: Date | null; // finish with doctor timestamp
  queueNum: number;
}
