// application/client/src/utils/checkString.jsx

export const checkString = (string) => {
  if (!string || typeof string !== "string") {
    return "Invalid input: Please provide a valid string";
  }
};
