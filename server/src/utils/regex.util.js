// ./server/src/utils/regex.util.js

/**
 * Regular expression to validate email addresses.
 *
 * The email must:
 * - Start with one or more lowercase letters or digits.
 * - Be followed by the @ symbol.
 * - Be followed by one or more lowercase letters (the domain name).
 * - Be followed by a literal dot (.).
 * - Be followed by 2 to 3 lowercase letters (the top-level domain).
 *
 * @example
 * // Valid emails
 * const validEmail1 = "quanghuy@gmail.com";
 * const validEmail2 = "quanghuy123@yahoo.edu";
 * const validEmail3 = "quanghuy123@gmail.co.uk";
 *
 * @type {RegExp}
 */
const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

/**
 * Regular expression to validate passwords.
 *
 * The password must:
 * - Be at least 8 characters long.
 * - Contain more than 1 letter and at least 1 number.
 *
 * @example
 * // Valid passwords
 * const validPassword1 = "quanghuy123";
 * const validPassword2 = "abcdefgh1";
 *
 * @type {RegExp}
 */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

/**
 * Regular expression to validate a user's full name.
 *
 * The full name must consist of:
 * - One or more letters, followed by an optional space and more letters.
 *
 * @example
 * // Valid full names
 * const validFullName1 = "John Doe";
 * const validFullName2 = "Jane Smith";
 *
 * @type {RegExp}
 */
const fullNameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

export { emailRegex, passwordRegex, fullNameRegex };
