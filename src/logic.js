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

/** The picture to draw for an item: its cutout when it has one, else the photo as taken. */
export function shownPhotoId(it) {
  return it?.cutout_file_id || it?.photo_id || "";
}

/**
 * What to tell someone whose request to remove a photo's background was
 * refused. `status` is the hub's HTTP status and `detail` its reply.
 *
 * A 429 is two different refusals: with a `limit` in the reply it is the
 * household's monthly allowance, without one it is the hub's per-minute limit.
 */
export function cutoutRefusal(status, detail = null) {
  if (status === 429 && typeof detail?.limit === "number") {
    return `This month's ${detail.limit} photo cutouts are used up. The photo is kept as taken.`;
  }
  if (status === 429) return "Too many requests just now. Try again in a minute.";
  if (status === 409) return "The background is already being removed. Try again in a few seconds.";
  if (status === 402) return "Removing photo backgrounds needs an active plan.";
  if (status === 503) return "Removing photo backgrounds is unavailable right now. Try again later.";
  if (status === 413) return "That photo is too large to remove the background from.";
  if (status === 415) return "The background can only be removed from a JPEG, PNG or WebP photo.";
  if (status === 507) return "There is no storage left for a photo with its background removed.";
  return "The background could not be removed.";
}

/**
 * The picture to draw where it is shown small: the small copy of whichever
 * picture is shown, else that picture itself. A cutout's small copy and the
 * photo's are different pictures, so neither stands in for the other.
 */
export function tilePhotoId(row) {
  if (row?.cutout_file_id) return row.cutout_thumb_file_id || row.cutout_file_id;
  return row?.thumb_file_id || row?.photo_id || "";
}
