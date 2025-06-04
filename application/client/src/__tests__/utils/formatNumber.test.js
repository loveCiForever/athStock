import { formatNumber } from "../../utils/formatNumber";

test("formatNumber: 123(number) → 123(string)", () => {
  expect(formatNumber(123)).toBe("123");
});

test("formatNumber: 12300(number) → 12,3 nghìn(string)", () => {
  expect(formatNumber(12300)).toBe("12,3 nghìn");
});

test("formatNumber: 123132312(number) → 123,13 triệu(string)", () => {
  expect(formatNumber(123132312)).toBe("123,13 triệu");
});

test("formatNumber: 1000000000(number) → 1 tỷ(string)", () => {
  expect(formatNumber(1000000000)).toBe("1 tỷ");
});

test("formatNumber: 1469000000(number) → 1,47 tỷ(string)", () => {
  expect(formatNumber(1469000000)).toBe("1,47 tỷ");
});

test("formatNumber: 2469000000000(number) → 1,47 nghìn tỷ(string)", () => {
  expect(formatNumber(2469000000000)).toBe("2,47 nghìn tỷ");
});
