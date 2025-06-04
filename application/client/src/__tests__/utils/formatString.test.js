import {
  UppercaseFirstLetterEachWord,
  UppercaseFullString,
  TruncateString,
  getBasePath,
} from "../../utils/formatString";

//   UppercaseFirstLetterEachWord
test("UppercaseFirstLetterEachWord: nguyen quang huy → Nguyen Quang Huy", () => {
  expect(UppercaseFirstLetterEachWord("nguyen quang huy")).toBe(
    "Nguyen Quang Huy"
  );
});

test("UppercaseFirstLetterEachWord: nguyen QUANG huy → Nguyen Quang Huy", () => {
  expect(UppercaseFirstLetterEachWord("nguyen QUANG huy")).toBe(
    "Nguyen Quang Huy"
  );
});

test("UppercaseFirstLetterEachWord: nguyen Quang huy → Nguyen Quang Huy", () => {
  expect(UppercaseFirstLetterEachWord("nguyen QUANG huy")).toBe(
    "Nguyen Quang Huy"
  );
});

test("UppercaseFirstLetterEachWord: 123 → Invalid string", () => {
  expect(() => UppercaseFirstLetterEachWord(123)).toThrow(/Invalid string/);
});

//   UppercaseFullString
test("UppercaseFullString: nguyen quang huy → NGUYEN QUANG HUY", () => {
  expect(UppercaseFullString("nguyen quang huy")).toBe("NGUYEN QUANG HUY");
});

test("UppercaseFullString: nguyen Quang huy → NGUYEN QUANG HUY", () => {
  expect(UppercaseFullString("nguyen Quang huy")).toBe("NGUYEN QUANG HUY");
});

test("UppercaseFullString: nguyen QUANG huy → NGUYEN QUANG HUY", () => {
  expect(UppercaseFullString("nguyen QUANG huy")).toBe("NGUYEN QUANG HUY");
});

test("UppercaseFullString: 123 → Invalid string", () => {
  expect(() => UppercaseFullString(123)).toThrow(/Invalid string/);
});

//   TruncateString
test("TruncateString: (nguyen QUANG huy, 2) → ng...", () => {
  expect(TruncateString("nguyen QUANG huy", 2)).toBe("ng...");
});

test("TruncateString: (NGUYEN QUANG huy, 6) → NGUYEN...", () => {
  expect(TruncateString("NGUYEN QUANG huy", 6)).toBe("NGUYEN...");
});

// getBasePath
test("getBasePath from full url: https://localhost:3000/admin/dashboard → admin", () => {
  expect(getBasePath("https://localhost:3000/admin/dashboard")).toBe("admin");
});

test("getBasePath: user/profile → user", () => {
  expect(getBasePath("user/profile")).toBe("user");
});

test("getBasePath: /news/asdjoiau8821_123 → news", () => {
  expect(getBasePath("/news/asdjoiau8821_123")).toBe("news");
});
