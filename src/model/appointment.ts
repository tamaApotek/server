/**
 * Appointment represent patient's appointment schedule with a doctor
 * Appointment can be made D-1 before the schedule, the user will get queue number
 * and **must** be re-registered at the day.
 *
 * IF by the time the patient re-register the queue number already missed,
 * shift the user
 */
export interface Appointment {
  id: string;
  /** user-id */
  doctorID: string;
  /** user-id */
  patientID: string;
  /** YYYY-MM-DD */
  date: string;
  /** default to false. switch to true when re-registered */
  isValidated: boolean;
  queueNumber: string;
}
