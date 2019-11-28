/**
 * Doctor represent doctor's info aside from user profile
 */
export interface Doctor {
  id: string;
  /** auth-uid indicate authenticated user or not */
  uid: string;
  /** indicate authenticated user or not */
  username: string;
  /**
   * general specialist id.
   * e.g General Practicioner, Ob Gyn, etc
   */
  specialistID: string;
  /** specialist and other degree */
  degrees: string[];
  fullName: string;
}
