// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export const CATEGORIES = ["general", "electronics", "appliance", "furniture", "jewelry", "tools", "kitchen", "clothing", "sports", "collectible", "documents"];

export function dollars(cents) {
  return (Number(cents || 0) / 100).toFixed(2);
}

export function toCents(v) {
  return Math.round((parseFloat(v) || 0) * 100);
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`). Brand,
 * model and serial are in here because an insurance claim is worked from the
 * label on the thing, not from whatever it was catalogued as.
 */
export function searchableFields(it) {
  return [it.name, it.location, it.category, it.brand, it.model, it.serial, it.notes];
}

export function totalValue(list) {
  return list.reduce((s, it) => s + Number(it.value_cents || 0) * Number(it.quantity || 1), 0);
}

export function knownLocations(items) {
  return [...new Set(items.map(x => x.location).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

// Group items by location or category, returning sorted group keys and the map.
export function groupItems(items, groupBy) {
  const groups = {};
  for (const it of items) {
    const key = (groupBy === "location" ? (it.location || "Unspecified location") : (it.category || "general"));
    (groups[key] ??= []).push(it);
  }
  const keys = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  return { keys, groups };
}
