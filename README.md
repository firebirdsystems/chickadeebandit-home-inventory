# Home Inventory

A searchable record of your possessions — the unsexy app you're grateful for the one time you
need it (a claim, a move, a "where did I put that?").

- **Photo, serial, value** per item, with make/model and purchase date for insurance claims.
- **Location, front and center** — every item records *where it lives*, so the inventory doubles as
  a "where did we put the good scissors?" finder.
- **Search that actually finds things** — item names, locations, categories, and serials are stored
  as plaintext columns (`db_plaintext_columns`) and indexed, so you can search across the whole
  house. Serial numbers, notes, and other fields stay encrypted at rest.
- **Append-only valuation history** — every value change is recorded, so you always have a defensible
  paper trail of what something was worth and when.

Group the catalogue **by location** or **by category**. Adults maintain the inventory; everyone in
the household can search it to find where things are.

## Quick start

```bash
npm run dev     # http://localhost:3001
npm run build   # produces dist/bundle.json
npm test
```
