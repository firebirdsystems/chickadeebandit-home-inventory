# Home Inventory

A [Chickadee Bandit](https://chickadeebandit.com/app-library/home-inventory) app.

A searchable record of your possessions — the unsexy app you're grateful for the one time you
need it (a claim, a move, a "where did I put that?").

- **Photo, serial, value** per item, with make/model and purchase date for insurance claims.
- **Location, front and center** — every item records *where it lives*, so the inventory doubles as
  a "where did we put the good scissors?" finder.
- **Search that actually finds things** — item names, locations, and categories are stored as
  plaintext columns (`db_plaintext_columns`) and indexed. Serial numbers, notes, and other fields
  stay encrypted at rest; search matches them on the device after they are read, so you can still
  look an item up by its serial.
- **Append-only valuation history** — every value change is recorded, so you always have a defensible
  paper trail of what something was worth and when.

Group the catalogue **by location** or **by category**. Adults maintain the inventory; everyone in
the household can search it to find where things are, serial numbers included.

Installable in a household or a shared space. In a space, every adult member catalogues and edits
items, and a granted guest can look things up but not change anything.

## Quick start

```bash
npm run dev     # http://localhost:3001
npm run build   # produces dist/bundle.json
npm test
```
