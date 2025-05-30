let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const getDay = (timestamp) => {
  let date = new Date(timestamp);

  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const getFullDay = (timestamp) => {
  let date = new Date(timestamp);

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateViEn = (date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};
