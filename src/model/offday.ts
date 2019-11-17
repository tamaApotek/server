/**
 * Offday represent doctor's leave schedule
 */
export interface Offday {
  doctorID: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  note: string;
}
