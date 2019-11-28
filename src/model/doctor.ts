/**
 * Doctor represent doctor's info aside from user profile
 */
export interface Doctor {
  id: string;
  /** auth-uid indicate authenticated user or not */
  uid: string;
  /** indicate authenticated user or not */
  username: string;
  specialistID: string;
  fullName: string;
  /** specialist title */
  title: string;
}
