/**
 * Doctor represent doctor's info aside from user profile
 */
export interface Doctor {
  id: string;
  /** auth-uid indicate authenticated user or not */
  uid: string | null;
  /** indicate authenticated user or not */
  specialistID: string;
  username: string | null;
  fullName: string;
  /** specialist title */
  title: string;
}
