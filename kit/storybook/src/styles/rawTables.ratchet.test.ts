import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A read-only table is a `DataTable`. These files still render their own `<table>`, each for
 * the reason given; nothing else under `pages/` or `components/` may. Both directions fail:
 * a new file here needs a reason, and a file that stops rendering a table leaves the list.
 */
const ALLOWED: Record<string, string> = {
  'components/Form/FormEquipmentTable/FormEquipmentTable.tsx': 'editable',
  'components/Form/FormToolsTable/FormToolsTable.tsx': 'editable',
  'components/Form/FormMaterialTable/FormMaterialTable.tsx': 'editable',
  'components/Form/FormJobsiteTrailerCards/FormJobsiteTrailerCards.tsx': 'editable',
  'pages/Settings/NotificationPreferencesSection.tsx': 'editable matrix',
  'pages/MirSync/PoDetailModal.tsx': 'editable lines + diff',
  'pages/MirSync/ConfigurationTab.tsx': 'editable',
  'pages/NouveauTracker/BidScheduleLinesTable.tsx': 'editable',
  'pages/RequisitionPrintWorksheet/RequisitionPrintWorksheet.tsx': 'print layout',
  'pages/FulfillmentQueue/FulfillmentQueuePage.tsx': 'detail rows',
  'pages/FulfillmentQueue/FulfillmentQueueRowDetail.tsx': 'nested in a detail row',
  'pages/FulfillmentWorkspace/FulfillmentItemsTable.tsx': 'detail rows',
  'pages/FulfillmentWorkspace/ExistingMode.tsx': 'skeleton of FulfillmentItemsTable',
  'pages/AutomatedProcesses/ProcessesTab.tsx': 'detail rows',
  'pages/AutomatedProcesses/FunctionsTable.tsx': 'nested in a detail row',
  'pages/ShippingQueue/ShippingQueueGroup.tsx': 'detail rows',
  'components/Display/DisplayEquipmentTable.tsx': 'display table, follow-up story',
  'components/Display/DisplayToolsTable.tsx': 'display table, follow-up story',
  'pages/Sse/Register/Table/RegisterTable.tsx': 'grouped header row and a fixed first column (register design §3)',
}

const SRC = join(__dirname, '..')

const sources = (dir: string, found: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) sources(full, found)
    else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) found.push(full)
  }
  return found
}

const withTables = ['pages', 'components']
  .flatMap((dir) => sources(join(SRC, dir)))
  .filter((path) => /<table[\s>]/.test(readFileSync(path, 'utf8')))
  .map((path) => relative(SRC, path).replace(/\\/g, '/'))
  .filter((path) => path !== 'components/ui/DataTable.tsx')

describe('raw table ratchet', () => {
  it('renders every other table through DataTable', () => {
    expect(withTables.filter((path) => !(path in ALLOWED))).toEqual([])
  })

  it('drops a file from the allow-list once it no longer renders a table', () => {
    expect(Object.keys(ALLOWED).filter((path) => !withTables.includes(path))).toEqual([])
  })
})
