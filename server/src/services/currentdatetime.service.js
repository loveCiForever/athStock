// currentdateime.service.js
const padZero = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};

const getCurrentDatetime = () => {
  const now = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayOfWeek = daysOfWeek[now.getDay()];
  const dayOfMonth = padZero(now.getDate());
  const month = padZero(now.getMonth() + 1); // Months are 0-indexed
  const year = padZero(now.getFullYear());
  const hour = padZero(now.getHours());
  const minute = padZero(now.getMinutes());
  const second = padZero(now.getSeconds());

  return {
    dayOfWeek,
    dayOfMonth,
    month,
    year,
    hour,
    minute,
    second,
  };
};

export { getCurrentDatetime };
