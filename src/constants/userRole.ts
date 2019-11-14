export type UserRole = "doctor" | "patient" | "admin" | "superuser";

const userRole = Object.freeze({
  DOCTOR: "doctor" as "doctor",
  PATIENT: "patient" as "patient",
  ADMIN: "admin" as "admin",
  GM: "superuser" as "superuser"
});

export default userRole;
