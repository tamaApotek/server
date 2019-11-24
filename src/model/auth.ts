/**
 * Auth implements partial properties of `auth.UserRecord`
 */
export interface Auth {
  /**
   * The user's `uid`.
   */
  uid: string;

  /**
   * The user's primary email, if set.
   */
  email: string;

  // /**
  //  * Whether or not the user's primary email is verified.
  //  */
  // emailVerified: boolean;

  /**
   * The user's display name.
   */
  displayName: string;

  /**
   * The user's primary phone number, if set.
   */
  phoneNumber: string;

  /**
   * Whether or not the user is disabled: `true` for disabled; `false` for
   * enabled.
   */
  disabled: boolean;

  password?: string;
}
