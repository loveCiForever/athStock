// regex.util.js

/*
    This regex is used to validate email addresses.
    Summary:
        Start with one or more lowercase letters or digits.
        Followed by the @ symbol.
        Followed by one or more lowercase letters (the domain name).
        Followed by a literal dot (.).
        Followed by 2 to 3 lowercase letters (the top-level domain).
    For example: quanghuy@gmail.com, quanghuy123@yahoo.edu, quanghuy123@gmail.co.uk
*/
const emailRegex = /^[a-z0-9]+@[a-z]+\\.[a-z]{2,3}$/;

/*
    This regex is used to validate password.

    Summary: The password must has at least 8 characters, more than 1 letter and 1 number.

    For example: quanghuy123, abcdefgh1
*/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,30}$/;

/*
    This regex is used to validate user's fullname.

    Summary:

    For example:
*/
const fullNameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

export { emailRegex, passwordRegex, fullNameRegex };
