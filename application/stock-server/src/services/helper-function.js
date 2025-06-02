export const isStringEmpty = (string) => {
  if (typeof string !== "string" || string === null || string === undefined) {
    return true;
  }

  return string.trim().length === 0;
};

export const isNumberEmpty = (num) => {
  return num === null || num === undefined || isNaN(num);
};
