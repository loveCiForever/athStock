const UppercaseFirstLetterEachWord = (fullName) => {
  if (!fullName) {
    return "User did not update Fullname";
  }

  return fullName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const UppercaseFullString = (string) => {
  return string.toUpperCase();
};
export { UppercaseFirstLetterEachWord, UppercaseFullString };
