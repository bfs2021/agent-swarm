import { describe, expect, test } from "bun:test";
import { parseTokenBudget } from "../commands/context-preamble";

describe("parseTokenBudget", () => {
  test.each(["abc", "0", "-5", "3.5", "", "  ", "NaN", "Infinity", undefined])(
    "falls back to the documented default for %p",
    (raw) => {
      expect(parseTokenBudget(raw as string | undefined, 2000)).toBe(2000);
    },
  );

  test("keeps a valid positive integer", () => {
    expect(parseTokenBudget("2500", 2000)).toBe(2500);
    expect(parseTokenBudget("1", 4000)).toBe(1);
  });

  test("a malformed budget still leaves a non-empty truncated preamble", () => {
    const budget = parseTokenBudget("abc", 2000);
    const preamble = "P".repeat(10_000);
    const truncated = preamble.slice(0, budget * 4);
    expect(truncated.length).toBe(8000);
    expect(truncated).toStartWith("P");
  });
});
