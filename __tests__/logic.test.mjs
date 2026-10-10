import { describe, it, expect } from "vitest";
import {
  CATEGORIES, dollars, toCents, searchableFields, totalValue, knownLocations, groupItems,
  shownPhotoId, tilePhotoId, cutoutRefusal,
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

describe("searchableFields", () => {
  const item = { name: "Drill", location: "Garage", category: "tools", brand: "Makita", model: "X", serial: "SN9", notes: "" };
  it("reaches brand, location and serial, not just the name", () => {
    const fields = searchableFields(item);
    expect(fields).toContain("Makita");
    expect(fields).toContain("Garage");
    expect(fields).toContain("SN9");
  });
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

describe("shownPhotoId", () => {
  it("draws the cutout when the item has one, else the photo as taken", () => {
    expect(shownPhotoId({ photo_id: "p1", cutout_file_id: "c1" })).toBe("c1");
    expect(shownPhotoId({ photo_id: "p1", cutout_file_id: null })).toBe("p1");
    expect(shownPhotoId({ photo_id: "p1" })).toBe("p1");
    expect(shownPhotoId({ photo_id: "" })).toBe("");
  });
});

describe("cutoutRefusal", () => {
  it("tells the monthly allowance apart from the per-minute limit", () => {
    expect(cutoutRefusal(429, { limit: 100 })).toBe("This month's 100 photo cutouts are used up. The photo is kept as taken.");
    expect(cutoutRefusal(429, { error: "Too many requests" })).toBe("Too many requests just now. Try again in a minute.");
    expect(cutoutRefusal(429)).toBe("Too many requests just now. Try again in a minute.");
  });
  it("says why for each refusal the hub can give", () => {
    expect(cutoutRefusal(409)).toMatch(/already being removed/);
    expect(cutoutRefusal(402)).toMatch(/active plan/);
    expect(cutoutRefusal(503)).toMatch(/unavailable right now/);
    expect(cutoutRefusal(413)).toMatch(/too large/);
    expect(cutoutRefusal(415)).toMatch(/JPEG, PNG or WebP/);
    expect(cutoutRefusal(507)).toMatch(/no storage left/);
  });
  it("falls back to a plain sentence for anything else", () => {
    expect(cutoutRefusal(500)).toBe("The background could not be removed.");
    expect(cutoutRefusal(undefined)).toBe("The background could not be removed.");
  });
});

describe("tilePhotoId", () => {
  it("draws the small copy of the picture shown, else that picture", () => {
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1", cutout_thumb_file_id: "ct1" })).toBe("ct1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: null })).toBe("t1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: null })).toBe("p1");
    expect(tilePhotoId({ photo_id: "p1" })).toBe("p1");
    expect(tilePhotoId(null)).toBe("");
  });
  it("never shows the photo's small copy for a cutout", () => {
    // A cutout with no small copy of its own is drawn whole.
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1", cutout_thumb_file_id: null })).toBe("c1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1" })).toBe("c1");
  });
});
