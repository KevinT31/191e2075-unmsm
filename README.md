<div align="center">

# Interactive Lot Map

### Real-Estate Lot Visualization · Credit Simulation · PDF Quotations

</div>

---

## Overview

**Interactive Lot Map** is a static web application for visualizing condominium/land-development plans and interacting with individual lots.

Visitors can inspect availability and lot details, while a separate browser-based editor supports plan creation, geometry editing, pricing and condominium configuration.

The project runs without a backend or database: published state is stored in versioned JavaScript data and rendered entirely in the browser.

## Main Capabilities

### Public Viewer

- interactive condominium plans
- lot status visualization
- lot area, perimeter and dimensions
- cash-price display
- credit simulation
- downloadable/printable PDF quotation flows
- direct links to individual condominiums
- embeddable viewer mode

### Plan Editor

- draw/edit lots, roads, common areas and terrain boundaries
- move and edit polygon points
- snapping behavior
- undo/redo
- brand configuration
- lot status and price editing
- credit configuration per condominium
- browser-local draft persistence
- export of the public data file

## Architecture

~~~mermaid
flowchart LR
    Data[data/condominios.js] --> Core[Shared Plan Engine]
    Core --> Viewer[index.html]
    Core --> Editor[editor.html]

    Viewer --> Quote[Credit Simulator / PDF]
    Editor --> Draft[Browser Draft]
    Draft --> Export[Export Updated Data File]
~~~

## Repository Structure

~~~text
index.html              public viewer
editor.html             visual editor
data/condominios.js     published condominium/lot data
assets/js/plano.js      shared plan renderer
assets/js/visor.js      viewer behavior
assets/js/editor.js     editor behavior
assets/css/estilo.css   styling
assets/img/             brand/reference assets
docs/USER_GUIDE.md      detailed editing/publishing guide
~~~

## Run Locally

No build step is required.

Open **index.html** directly in a browser, or serve the repository as static files.

For the editor, open **editor.html**.

## Publish with GitHub Pages

The project is compatible with static hosting such as GitHub Pages because it does not require a server runtime.

Typical publishing flow:

1. publish the repository from the main branch
2. select the repository root as the Pages source
3. access the viewer through the generated GitHub Pages URL

See the [detailed user/editor guide](./docs/USER_GUIDE.md) for embedding, editing and publishing instructions.

## Credit Simulation

The browser-side simulator supports configurable:

- cash vs credit-list base price
- fixed-payment TEA flow
- simple annual interest
- no-interest plans
- down payment
- term options
- per-term rates
- quotation validity

Because the simulator is entirely client-side, every value required by it is publicly downloadable with the static site.

## Public Data Boundary

**Anything stored in data/condominios.js is public when the site is published.**

Do not place in that file:

- internal contacts
- responsible-person names
- private margins
- confidential commercial notes
- credentials
- any data that should not be downloadable by a visitor

The project intentionally keeps the published dataset separate from private operational systems.

## Current Scope

This repository is a static visualization/editor tool. It does not implement:

- authenticated CRM workflows
- server-side inventory locking
- transactional sales operations
- private pricing storage
- multi-user concurrency

Those concerns belong in a backend/operational platform rather than a public static viewer.

---

### What this project demonstrates

**Vanilla JavaScript · browser geometry/editor tooling · static architecture · financial simulation · PDF-oriented UX · real-estate product tooling**
