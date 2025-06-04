import chalk from "chalk";

const getTimestamp = () => {
  return new Date().toLocaleString("vi-US", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const logger = {
  info: (msg) =>
    console.log(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.magenta(`${msg}`)}`
    ),
  success: (msg) =>
    console.log(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.green(`${msg}`)}`
    ),
  warning: (msg) =>
    console.log(
      `${chalk.gray(`[${getTimestamp()}]`)} ${chalk.yellow(`${msg}`)}`
    ),
  error: (msg) =>
    console.log(`${chalk.gray(`[${getTimestamp()}]`)} ${chalk.red(`${msg}`)}`),
  data: (msg) =>
    console.log(`${chalk.gray(`[${getTimestamp()}]`)} ${chalk.cyan(`${msg}`)}`),
};

export const isStringEmpty = (string) => {
  if (typeof string !== "string" || string === null || string === undefined) {
    return true;
  }

  return string.trim().length === 0;
};

export const isNumberEmpty = (num) => {
  return num === null || num === undefined || isNaN(num);
};
