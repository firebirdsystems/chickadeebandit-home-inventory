-- Automations catalogue an item on a member's behalf
-- (manifest.automation_actions.add_item).
--
-- `source_event_id` records which app event produced the row. The dispatcher's
-- dedupe guard reads it before running an action (SELECT 1 ... WHERE
-- source_event_id = ? LIMIT 1), so one event can never be applied twice --
-- neither by a retry nor by two rules pointed at the same trigger.
--
-- Nullable on purpose: every item the app's own UI creates leaves it NULL.
ALTER TABLE app_home_inventory__items ADD COLUMN source_event_id TEXT;

CREATE INDEX IF NOT EXISTS app_home_inventory__items_source_event_idx
  ON app_home_inventory__items (source_event_id);
