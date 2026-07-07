CREATE TABLE IF NOT EXISTS app_home_inventory__items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  location TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  model TEXT DEFAULT '',
  serial TEXT DEFAULT '',
  value_cents INTEGER NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  photo_id TEXT DEFAULT '',
  purchased_at TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_by_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS app_home_inventory__valuations (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT DEFAULT '',
  recorded_by TEXT NOT NULL,
  recorded_by_name TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS app_home_inventory__items_name_idx ON app_home_inventory__items(name);
CREATE INDEX IF NOT EXISTS app_home_inventory__items_location_idx ON app_home_inventory__items(location);
CREATE INDEX IF NOT EXISTS app_home_inventory__items_category_idx ON app_home_inventory__items(category);
CREATE INDEX IF NOT EXISTS app_home_inventory__valuations_item_idx ON app_home_inventory__valuations(item_id, recorded_at);
