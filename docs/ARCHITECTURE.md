# Interactive Lot Map — Architecture

## Static Application Model

The application intentionally has no backend runtime.

~~~text
Published data file
      ↓
shared plan renderer
   ├─→ public viewer
   │     ├─ lot details
   │     ├─ credit simulator
   │     └─ printable/PDF views
   │
   └─→ browser editor
         ├─ geometry editing
         ├─ pricing/configuration
         ├─ local draft state
         └─ exported updated data file
~~~

## Main Modules

- **data/condominios.js** — published data/configuration
- **assets/js/plano.js** — shared geometry/renderer logic
- **assets/js/visor.js** — visitor-facing behavior
- **assets/js/editor.js** — editor behavior
- **index.html** — public viewer
- **editor.html** — browser editor

## Persistence Model

Draft editor state is local to the browser.

Publishing is explicit: the editor exports an updated data file that is then versioned/deployed with the static site.

## Security / Privacy Boundary

There is no private server-side storage.

Therefore, every value needed by the public viewer or credit simulator is downloadable by any visitor. Confidential operational data must stay outside this repository.

## Appropriate Use

This architecture is a good fit for:

- public visualization
- static plan publishing
- client-side simulation
- lightweight embedding

It is not suitable by itself for:

- private CRM records
- transactional inventory locking
- authenticated sales operations
- confidential pricing logic
- multi-user concurrent editing
