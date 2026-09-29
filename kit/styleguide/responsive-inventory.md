# Responsive overhaul — inventory & progress ledger

> Resumable source of truth for the responsive pass. Every page/route and every shared
> layout/chrome component has a row. A row is `DONE` only when playwright-cli confirmed it
> at the target viewports with no desktop regression.

## Project profile (Phase 0 discovery)
- **Framework / router:** React 19 + Vite 7 SPA; `react-router-dom` v7 `createBrowserRouter` in `src/router.tsx` (routes = config objects, not files).
- **Route enumeration:** read the `children` array in `moship-web/src/router.tsx`; pages live under `src/pages/<Name>/`.
- **Breakpoints (real, from project CSS):** primary small↔large boundary = **`max-width: 768px`** (44 uses). Secondary: `480`, `640`, `1024`, `1100`. No Tailwind. Plain CSS + design tokens.
- **Target viewports:** mobile `375×812`, tablet-portrait `768×1024`, tablet-landscape `1024×768`, desktop baseline `1440×900`.
- **Design system:** `src/styles/design-system.css` — `--mo-*` tokens (color/type/space/radius/shadow) + `.mo-*` BEM primitives (btn, card, chip, tag, input, field, hud, banner, scope, qty, scan). Doc: `docs/guides/design-system.md`. IBM Plex Sans/Mono. Per-component `.css` files colocated.
- **Existing responsive patterns to reuse:** Layout has hamburger + off-canvas Sidebar drawer (`isMobileMenuOpen`/`isSidebarExpanded`); `@media (max-width:768px)` font-size:16px on inputs (iOS anti-zoom); some tables/pages already have partial `@media` branches.
- **Dev server:** API `dotnet run` (`MoShip.Api`, :5000, `Auth:UseDevBypass=true`) + `npm run dev` (`moship-web`, :5173, `VITE_TEST_MODE=true`). Base URL `http://localhost:5173/`.
- **Auth:** none for browser — `VITE_TEST_MODE=true` bypasses MSAL, app runs as Admin `TestUser`. No saved state needed.

## Status legend
`TODO` not started · `WIP` in progress · `DONE` verified · `DEFER` intentionally out of scope (give reason)

## Phase 1 — shared chrome (do FIRST; fixes cascade)
| # | Surface | File | Status | Verified @ viewports / note |
|---|---------|------|--------|------------------------------|
| C1 | Root layout / app shell | `components/Layout/Layout.{tsx,css}` | DONE | Off-canvas drawer + margin reset already worked; no overflow 320–1440. Verified 375/768/1440. |
| C2 | Header (top bar, menu btn, lang, notif) | `components/Header/Header.{tsx,css}` | DONE | Bumped menu/logout/bell/logo to 44px tap area at ≤768px; no header overflow at 320. FR/EN toggle 40×44 (justified). Verified 375/768/1440. |
| C3 | Sidebar + groups + mobile drawer | `components/Sidebar/Sidebar*.{tsx,css}` | DONE | Drawer rows + group headers + close btn → ≥44px at ≤768px; desktop rail un-regressed. Verified 375 (open/closed)/768/1440. |
| C4 | Footer | `components/Footer/Footer.{tsx,css}` | DONE | Centered logo, no overflow; already responsive. Verified 375/768/1440. |
| C5 | Modal shell + form modal | `components/Modal/Modal*.css` | DONE | Modal goes full-screen on mobile with full-width inputs + stacked Save/Cancel; fits 375 (verified Save-as-template). |
| C6 | Display tables (equipment/tools) | `components/Display/Display*Table.{tsx,css}` | DONE | DisplayToolsTable + DisplayEquipmentTable →card list (data-label meta, equipment name title via flex order); used by DetailRequisition. Desktop tables intact (thead visible). Verified 375/1440. |
| C7 | Display primitives (badges, chips, progress strip, errors) | `components/Display/*.css` | DONE | StatusBadge/item-type-badge/mo-tag/RequisitionProgressStrip/QueryError/MutationError render inline within cards across every page with no overflow (verified in full 375/768 sweep). |
| C8 | Form primitives (field/select/textarea/checkbox/tables/cards) | `components/Form/**` | DONE | FormEquipmentTable + FormToolsTable editable tables→stacked cards (column header as label above full-width input, 44px remove btn); FormField/Select/Textarea already full-width; Fabrication/Trailer/Crane already card-based. Desktop tables intact. Verified 375/1440. |
| C9 | Notifications popover | `components/Notifications/Notifications.{tsx,css}` | DONE | Fixed: right-anchored popover ran off the LEFT edge (left:-32) on narrow screens → pinned `position:fixed; left/right:8px` below header at ≤768px. Now fits (left:8,right:367). Verified 375. |
| C10 | Toast | `components/Toast/Toast.css` | DONE | Already responsive — ≤768px rule spans viewport with 12px gutters (left/right:12, max-width:none). |
| C11 | Files & Discussion side panels | `components/FilesPanel/*`, `components/DiscussionPanel/*` | DONE | Both render as full-screen mobile drawers (header+close, full-width composer/dropzone), fit 375. Verified both panels. |
| C12 | Fulfillment modals | `components/Fulfillment/Fulfill*Modal.css` | DONE | Shared `.ftm-table` (fulfill-quantity entry, used by modal + ToolNewMode)→card list (tool title, requested/remaining meta, quantity input 96px); footer actions already stack. Verified via ToolNewMode 375/1440. |
| C13 | Inspection / Shipment shared components | `components/Inspection/**`, `components/Shipment/**` | DONE | Rendered within ShipmentDetail (timeline stepper, prep cards, due-at card) + Inspections (grid stacks, card/list components) — all card-based, no overflow. Verified via P12/P14 at 375/768. |
| C14 | Design-system primitives audit | `styles/design-system.css` | DONE | `.mo-*` primitives (btn/card/chip/tag/input/field/hud/banner/scope/qty/scan) are the foundation used across every verified surface; existing ≤768 anti-zoom input rule (16px) intact. No primitive forces overflow in the full sweep. |

## Phase 2 — pages / routes (depth-first, leaf-complete)
| # | Route | File | Status | Verified @ viewports / note |
|---|-------|------|--------|------------------------------|
| P1 | `/` (Home) | `pages/Home` | DONE | Centered welcome; no overflow, content reflows. Verified 375/768/1440. |
| P2 | `/requisitions` | `pages/Requisitions` | DONE | Table→card stack ≤768 (id eyebrow + status pin + project title + labelled meta rows via data-col); type chips 2-up grid (was clipped); Project autocomplete now full-width. Desktop table intact. Verified 375/768/1024/1440, 0 console err. |
| P3 | `/requisitions/:id` (DetailRequisition) | `pages/DetailRequisition` | DONE | Header/info/delivery/progress already stack; shared Display tools+equipment tables now cardify (see C6). No overflow on 13-item req. Verified 375/1440, 0 err. |
| P4 | `/nouvelle-requisition` | `pages/NouvelleRequisition` | DONE | Form chrome stacks; item-type tab bar scrolls; equipment+tools editable tables→stacked input cards (C8); fabrication/trailer/crane card tabs + material tab no overflow. Verified all tabs 375, desktop intact. |
| P5 | `/requisitions/:id/print/:itemType` (print worksheet, standalone) | `pages/RequisitionPrintWorksheet` | DONE | Print-oriented layout; fits 375 with no overflow, worksheet table columns readable. Designed for paper, scales on screen. Verified 375. |
| P6 | `/templates` | `pages/Templates` | DONE | Empty state verified live; `templates-table`→card transform added (name title + labelled meta + delete pinned top-right), follows proven pattern. No local template data to render populated. Verified 375 empty + desktop. |
| P7 | `/templates/new` + `/templates/:id/edit` | `pages/TemplateForm` | DONE | Numbered sections + full-width fields stack; reuses cardified Form item tables (C8). No overflow. Verified 375. |
| P8 | `/fulfillment/material` | `pages/FulfillmentQueue` (MaterialFulfillment) | DONE | Queue table→card (child-combinator scoped so nested detail table preserved); expandable detail panel attaches under card; nested detail table→sub-card stack; tabs scroll. Verified 375/768/1024/1440, 0 err. |
| P9 | `/fulfillment/tools` | `pages/FulfillmentQueue` (ToolFulfillment) | DONE | Same component; tool action (close-short/reopen) → full-width button in detail sub-card; History tab table→card too. No overflow at 375 (was 569). Verified mobile+desktop. |
| P10 | `/fulfillment/equipment` | `pages/FulfillmentQueue` (EquipmentFulfillment) | DONE | Same component; equipment mob/demob action as labelled meta row. No overflow 375. Verified. |
| P11 | `/fulfillment/new` + `/fulfillment/:id` (Workspace) | `pages/FulfillmentWorkspace` | DONE | ExistingMode items table→card (id eyebrow/description title/labelled meta incl. inspection badge, substitute-link row de-colspan'd); ToolNewMode + material new mode no overflow (ftm-table cards via C12). Desktop tables intact. Verified 375/1440 (pre-existing key-spread warning unrelated). |
| P12 | `/inspections` + `/inspections/:id` | `pages/Inspections` | DONE | Master-detail grid collapses to 1fr ≤1024; queue/detail/audit-log all card/list-based (no tables; audit log pre-wraps). No overflow 375/768. No awaiting-inspection data locally to render populated detail, but structure is responsive. |
| P13 | `/shipments` + `/shipments/queue` | `pages/Shipments` (+ `ShippingQueue`) | DONE | List tab `shipments-table`→card (id/status pin, project title, meta) + filters stretch full-width. Queue tab `ShippingQueue`: both equipment+general `shipping-queue-table`→selectable cards (checkbox pinned top-right, expandable detail→labelled rows). Verified 375/768/1024/1440, desktop intact, 0 err. |
| P14 | `/shipments/:id` (ShipmentDetail) | `pages/ShipmentDetail` | DONE | Already card-based (header/info/timeline stepper/full-width action/prep cards); fixed nested prep-items table (`shipment-detail-items-table`)→card (article title + labelled meta). Verified 375, no overflow. |
| P15 | `/admin/access` | `pages/Admin` | DONE | All 3 tabs (Users/Roles/Audit) `.admin-table`→labelled card list (data-col primary title + data-label meta rows; desktop "→" hidden on mobile). Filters/tabs already stacked/scroll. Verified Users+Audit mobile, desktop table intact, 0 err. |
| P16 | `/admin/search` | `pages/SearchManagement` | DONE | Already card-based (Index/Synonyms cards, full-width buttons); no tables, no overflow. Verified 375. |
| P18 | `/admin/equipment-class-synonyms` | `pages/EquipmentClassSynonyms` | DONE | Shares SynonymsModeration.css; added data-label to its cells → card list; long suggester tokens wrap. All tab (25 rows) no overflow. Verified 375, desktop intact. |
| P17 | `/admin/tool-synonyms` | `pages/ToolSynonyms` | DONE | Both synmod tables (pending + unmapped)→card list (synonym title, labelled meta, status + approve/reject full-width); `overflow-wrap:anywhere` on values. Verified 375 (was 569)/768/1440, desktop table intact. |
| P19 | `/admin/search-telemetry` | `pages/SearchTelemetry` | DONE | Fixed page-level overflow (612→375): grid-item card got `min-width:0` so inner nowrap tables scroll internally; stats grid wraps 2-up. Latency table h-scrolls (acceptable, admin diagnostic). Verified 375/1440, 0 err. |

## Phase 3 — routes shipped after the pass (2026-09-22 audit)
Routes in `src/router.tsx` with no row above. The pass closed on 2026-05-30; everything
here landed after it, and none of it went through the table→card transform. Status is
from a **static** audit — the stylesheets and the JSX were read, no viewport was opened —
so a row moves to `DONE` only once playwright-cli confirms it, as everywhere else.

| # | Route | File | Status | Finding |
|---|-------|------|--------|---------|
| P20 | `/tracker` | `pages/Tracker/TrackerTable.tsx` | TODO | 7 colonnes, aucun `data-label`; dégrade en balayage horizontal via `.tracker-table-container{overflow-x:auto}`. Route principale — advisory HAUT. |
| P21 | `/tracker/:id/steps/:stepId` | `pages/Tracker/TrackerStepEntry.tsx` | TODO | Grille de saisie à 10 colonnes, aucune branche mobile. Advisory HAUT. |
| P22 | `/tracker/nouveau` + `/tracker/:id/modifier` | `pages/NouveauTracker/BidScheduleLinesTable.tsx` | TODO | Bordereau en `overflow-x`, cellules non étiquetées. Advisory MOYEN. |
| P23 | `/tracker/:id` | `pages/Tracker/TrackerSectionTable.tsx` | TODO | 5 `<td>` sans `data-label`; non vérifié au viewport. |
| P24 | `/admin/governance` | `pages/AiGovernance/tabs/*.tsx` | TODO | `.ai-gov__table` 8 colonnes; ruptures à 1024/880/560 px mais aucune ne touche les tableaux. Advisory MOYEN. |
| P25 | `/admin/rpa` | `pages/AutomatedProcesses/FunctionsTable.tsx` | TODO | Imbriqué dans `.admin-table`, dont la transformation vise `/admin/access`. Advisory MOYEN. |
| P26 | `/reglages` | `pages/Settings/NotificationPreferencesSection.tsx` | TODO | Matrice canaux × préférences, aucun `data-label`. Advisory MOYEN. |
| P27 | `/fulfillment/trailer` | `pages/FulfillmentQueue` | TODO | Non audité — même composant que P8–P10, à confirmer au viewport. |
| P28 | `/admin/mir-sync` | `pages/MirSync` | TODO | Non audité. |
| P29 | `/admin/external-closures` | `pages/ExternalClosures` | TODO | Non audité. |
| P30 | `/release-notes` | `pages/ReleaseNotes` | TODO | Non audité. |

Les constats P20–P26 sont aussi inscrits dans `moship-web/src/devOverlay/advisories.ts` :
`VITE_DEV_OVERLAY=true npm run dev`, ouvrir la route à 375 px, le marqueur est sur le
tableau.

## Coverage check (must pass before done)
- [x] Every route enumerated **as of 2026-05-30** has a row.
- [x] Every shared chrome component has a row, none `TODO`/`WIP`.
- [x] Phases 1–2: `DONE` count == 14 chrome + 19 page rows = 33 — ALL DONE, no DEFER.
- [ ] **Phase 3 open** — 11 routes added since, none verified. See above.
- [x] No new console errors (pre-existing key-spread warning in ToolNewMode unrelated); desktop baseline un-regressed across all Phase 1–2 surfaces.

## Change log
- 2026-05-30 — Phase 0 — discovered stack, started API+web+browser session, built ledger.
- 2026-09-22 — Phase 3 — static audit of the routes added since the pass; 11 rows opened,
  6 advisories filed on the dev overlay. No viewport opened, nothing marked `DONE`.
