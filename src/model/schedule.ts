/**
 * Schedule represent doctor's schedule for each day'
 */
export interface Schedule {
  id: string;
  /** user-id */
  doctorID: string;
  /** iso day week 1 ~ 7 */
  dayOfWeek: number;
  /** 0 ~ 23 */
  startHour: number;
  /** 0 ~ 59 */
  startMinute: number;
  /** 0 ~ 23 */
  endHour: number;
  /** 0 ~ 59 */
  endMinute: number;
  /** queue limit */
  limit: number;
}
