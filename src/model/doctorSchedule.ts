export interface Schedule {
  assistants: string[];
  /** iso day week 1 ~ 7 */
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

/**
 * DoctorSchedule represent doctor and team's schedule
 */
export interface DoctorSchedule {
  id: string;
  /** user-id */
  doctorID: string;
  /** user-id */
  assistants: string[];
  schedules: Schedule[];
}
