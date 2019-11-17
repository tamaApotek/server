export interface Schedule {
  assistants: string[];
  /** iso day week 1 ~ 7 */
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface DoctorSchedule {
  doctorID: string;
  assistants: string[];
  schedules: Schedule[];
}
