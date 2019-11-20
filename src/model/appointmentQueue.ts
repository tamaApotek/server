/**
 * QueueItem represent each day patient queue.
 * must be able to combine manual input queue and app input queue
 */
export interface QueueItem {
  patientID: string;
  patientName: string;
  /**
   * default to false
   * if patient failed to re-register, switch to true
   */
  isDelayed: boolean;
  isFinished: boolean;
  startTime: Date;
  endTime: Date;
}

/**
 * AppointmentQueue represent each date queue.
 * embed patient name to queue list.
 * Queue list must be updated each time patient's queue shifted
 */
export interface AppointmentQueue {
  /** user-id */
  doctorID: string;
  /** YYYY-MM-DD */
  date: string;
  queue: QueueItem[];
}
