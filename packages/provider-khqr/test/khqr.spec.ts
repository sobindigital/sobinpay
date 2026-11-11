import { describe, it, expect } from "vitest";
import { KhqrGenerator, KhqrParser, calculateCrc16 } from "../src/index.js";

describe("Bakong KHQR Provider", () => {
  it("calculates CRC16-CCITT correctly", () => {
    // Known test vector
    const crc = calculateCrc16("123456789");
    expect(crc).toBe("29B1");
  });

  it("generates and parses a valid individual Bakong KHQR", () => {
    const qrString = KhqrGenerator.generateIndividual({
      bakongAccountId: "sobin_digital@aclb",
      merchantName: "Sobin Digital",
      amount: 25.5,
      currency: "USD",
      billNumber: "INV-1001",
    });

    expect(qrString).toBeDefined();
    expect(qrString.startsWith("000201010212")).toBe(true);

    const parsed = KhqrParser.parse(qrString);
    expect(parsed.isValid).toBe(true);
    expect(parsed.bakongAccountId).toBe("sobin_digital@aclb");
    expect(parsed.merchantName).toBe("Sobin Digital");
    expect(parsed.amount).toBe(25.5);
    expect(parsed.currency).toBe("USD");
  });

  it("generates valid KHR static KHQR without amount", () => {
    const qrString = KhqrGenerator.generateIndividual({
      bakongAccountId: "developer@devb",
      merchantName: "Dev Store",
      currency: "KHR",
    });

    expect(qrString.startsWith("000201010211")).toBe(true); // 11 is static
    const parsed = KhqrParser.parse(qrString);
    expect(parsed.isValid).toBe(true);
    expect(parsed.currency).toBe("KHR");
    expect(parsed.amount).toBeUndefined();
  });
});

