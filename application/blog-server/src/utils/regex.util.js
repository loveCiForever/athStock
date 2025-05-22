// regex.util.js

/**
 * Regular expression to validate passwords.
 *
 * The password must have:
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one digit
 *  - At least one special character (from !@#$%^&* )
 *  - Length between 8 and 30 characters
 *
 * @example
 * const valid1 = "QuangHuy@1";
 * const valid2 = "Test#Password2";
 *
 * @type {RegExp}
 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

export { passwordRegex };
