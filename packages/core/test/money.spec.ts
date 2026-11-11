import { describe, it, expect } from "vitest";
import { createMoneyAmount, formatCompactUtcTimestamp } from "../src/utils/money.js";
import { InvalidAmountError } from "../src/errors/index.js";

describe("Money Utilities", () => {
  it("formats USD currency to minor cents and fixed string", () => {
    const usd = createMoneyAmount(10.5, "USD");
    expect(usd.amount).toBe(10.5);
    expect(usd.currency).toBe("USD");
    expect(usd.minorUnits).toBe(1050);
    expect(usd.formatted).toBe("10.50");
  });

  it("formats KHR currency to integer riels", () => {
    const khr = createMoneyAmount(40000.4, "KHR");
    expect(khr.amount).toBe(40000);
    expect(khr.currency).toBe("KHR");
    expect(khr.minorUnits).toBe(40000);
    expect(khr.formatted).toBe("40000");
  });

  it("throws on invalid or non-positive amount", () => {
    expect(() => createMoneyAmount(-5)).toThrow(InvalidAmountError);
    expect(() => createMoneyAmount(0)).toThrow(InvalidAmountError);
    expect(() => createMoneyAmount(NaN)).toThrow(InvalidAmountError);
  });

  it("formats compact UTC timestamp with 14 digits", () => {
    const date = new Date(Date.UTC(2026, 9, 31, 15, 30, 45));
    expect(formatCompactUtcTimestamp(date)).toBe("20261031153045");
  });
});

