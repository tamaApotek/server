export interface AuthProvider {
  /** Provider Name */
  name: string;
  email: string | null;
}

/**
 * Default login access uses username and password
 *
 * In the future user may:
 * Use `phoneNumber` to login, phoneNumber is unique per person,
 * User can has multiple email address to login,
 * and login through external provider (e.g. google)
 */
export interface Auth {
  id: string;
  displayName: string;
  username: string;
  password: string;
  phoneNumber: string | null;
  providers: AuthProvider[];
}

// export default function buildMakeUserCredentrial({}: {
//   emailValidator: (email: string) => boolean;
// }) {
//   return function makeUserCredential(
//     userCred: UserCredential
//   ): UserCredential {

//   };
// }
