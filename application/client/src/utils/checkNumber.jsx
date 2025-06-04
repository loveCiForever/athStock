// application/client/src/utils/checkNumber.jsx

export const checkNumber = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("Input must be a valid number");
  }
};
