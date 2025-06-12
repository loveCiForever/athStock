import {
  getDayMonth,
  getDayMonthYear,
  formatDateViEn,
} from "../../utils/formatDate";

// getDayMonth()
test("getDayMonth – Unix timestamp: 1749050069 → 4 Tháng 6", () => {
  expect(getDayMonth(1749050069)).toBe("5 Tháng 6");
});

test("getDayMonth – Unix timestamp: 1764749902 → 3 Tháng 12", () => {
  expect(getDayMonth(1764749902)).toBe("3 Tháng 12");
});

test("getDayMonth – Millisecond: 1123143502000 → 4 Tháng 8", () => {
  expect(getDayMonth(1123143502000)).toBe("4 Tháng 8");
});

test("getDayMonth – Millisecond: 1153729102000 → 24 Tháng 7", () => {
  expect(getDayMonth(1153729102000)).toBe("24 Tháng 7");
});

test("getDayMonth – Chuỗi ISO (string): '2025-10-05T00:00:00Z' → 5 Tháng 10", () => {
  expect(getDayMonth("2025-10-05T00:00:00Z")).toBe("5 Tháng 10");
});

test("getDayMonth – Date object: new Date(2024, 0, 1) → 1 Tháng 1", () => {
  expect(getDayMonth(new Date(2024, 0, 1))).toBe("1 Tháng 1");
});

test("getDayMonth – Input invalid (NaN) phải throw Error", () => {
  expect(() => getDayMonth("abc")).toThrow(/Invalid date/);
});

// getDayMonthYear()
test("getDayMonthYear – Unix timestamp: 1749050069 → 4 Tháng 6", () => {
  expect(getDayMonthYear(1749050069)).toBe("4 Tháng 6 2025");
});

test("getDayMonthYear – Unix timestamp: 1764749902 → 3 Tháng 12", () => {
  expect(getDayMonthYear(1764749902)).toBe("3 Tháng 12 2025");
});

test("getDayMonthYear – Millisecond: 1123143502000 → 4 Tháng 8", () => {
  expect(getDayMonthYear(1123143502000)).toBe("4 Tháng 8 2005");
});

test("getDayMonthYear – Millisecond: 1153729102000 → 24 Tháng 7", () => {
  expect(getDayMonthYear(1153729102000)).toBe("24 Tháng 7 2006");
});

test("getDayMonthYear – Chuỗi ISO (string): '2025-10-05T00:00:00Z' → 5 Tháng 10", () => {
  expect(getDayMonthYear("2025-10-05T00:00:00Z")).toBe("5 Tháng 10 2025");
});

test("getDayMonthYear – Date object: new Date(2024, 0, 1) → 1 Tháng 1", () => {
  expect(getDayMonthYear(new Date(2024, 0, 1))).toBe("1 Tháng 1 2024");
});

test("getDayMonthYear – Input invalid (NaN) phải throw Error", () => {
  expect(() => getDayMonthYear("abc")).toThrow(/Invalid date/);
});

// formatDateViEn()
test("formatDateViEn – Date object: new Date(2024, 0, 1) → 01/01/2024", () => {
  expect(formatDateViEn(new Date(2024, 0, 1))).toBe("01/01/2024");
});

test("formatDateViEn – Date object: new Date(2006, 6, 24) → 24/07/2006", () => {
  expect(formatDateViEn(new Date(2006, 6, 24))).toBe("24/07/2006");
});

test("formatDateViEn – Date object: new Date(2005, 7, 4) → 04/08/2005", () => {
  expect(formatDateViEn(new Date(2005, 7, 4))).toBe("04/08/2005");
});
