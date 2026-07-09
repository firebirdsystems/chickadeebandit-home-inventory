import { describe, it, expect } from "vitest";
import {
  CATEGORIES, dollars, toCents, matches, totalValue, knownLocations, groupItems,
} from "../src/logic.js";

describe("dollars / toCents", () => {
  it("dollars formats cents", () => {
    expect(dollars(12345)).toBe("123.45");
    expect(dollars(null)).toBe("0.00");
  });
  it("toCents parses dollars", () => {
    expect(toCents("12.34")).toBe(1234);
    expect(toCents("abc")).toBe(0);
  });
});

describe("matches", () => {
  const item = { name: "Drill", location: "Garage", category: "tools", brand: "Makita", model: "X", serial: "SN9", notes: "" };
  it("matches with empty query", () => expect(matches(item, "")).toBe(true));
  it("searches across fields case-insensitively", () => {
    expect(matches(item, "makita")).toBe(true);
    expect(matches(item, "garage")).toBe(true);
    expect(matches(item, "sn9")).toBe(true);
  });
  it("returns false when nothing matches", () => expect(matches(item, "zzz")).toBe(false));
});

describe("totalValue", () => {
  it("sums value_cents times quantity", () => {
    expect(totalValue([{ value_cents: 1000, quantity: 2 }, { value_cents: 500 }])).toBe(2500);
  });
  it("defaults quantity to 1 and value to 0", () => {
    expect(totalValue([{ value_cents: 1000 }, {}])).toBe(1000);
  });
});

describe("knownLocations", () => {
  it("returns sorted, unique, non-empty locations", () => {
    const items = [{ location: "Garage" }, { location: "Attic" }, { location: "Garage" }, { location: "" }, {}];
    expect(knownLocations(items)).toEqual(["Attic", "Garage"]);
  });
});

describe("groupItems", () => {
  const items = [
    { id: "1", location: "Garage", category: "tools" },
    { id: "2", location: "Attic", category: "general" },
    { id: "3", location: "", category: "tools" },
  ];
  it("groups by location with a fallback bucket", () => {
    const { keys, groups } = groupItems(items, "location");
    expect(keys).toEqual(["Attic", "Garage", "Unspecified location"]);
    expect(groups.Garage.map(i => i.id)).toEqual(["1"]);
  });
  it("groups by category", () => {
    const { keys, groups } = groupItems(items, "category");
    expect(keys).toEqual(["general", "tools"]);
    expect(groups.tools.map(i => i.id)).toEqual(["1", "3"]);
  });
});

describe("CATEGORIES", () => {
  it("includes the default category first", () => expect(CATEGORIES[0]).toBe("general"));
});
