import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { DataTable } from './DataTable'
import { LoadingOverlay } from './LoadingOverlay'

describe('LoadingOverlay', () => {
  it('makes the page behind inert and holds focus until it unmounts', () => {
    const { unmount } = render(<button type="button">Téléverser</button>)
    const alreadyInert = document.createElement('div')
    alreadyInert.setAttribute('inert', '')
    document.body.append(alreadyInert)
    const trigger = screen.getByRole('button', { name: 'Téléverser' })
    trigger.focus()
    const page = trigger.parentElement!

    const overlay = render(<LoadingOverlay label="Téléversement du fichier…" detail="Ne fermez pas l’onglet." />)
    const dialog = screen.getByRole('dialog', { name: 'Téléversement du fichier…' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-busy', 'true')
    expect(dialog).toHaveAccessibleDescription('Ne fermez pas l’onglet.')
    expect(page).toHaveAttribute('inert')
    expect(document.activeElement).toBe(dialog)

    overlay.unmount()

    expect(page).not.toHaveAttribute('inert')
    expect(alreadyInert).toHaveAttribute('inert')
    expect(document.activeElement).toBe(trigger)
    alreadyInert.remove()
    unmount()
  })
})

describe('Button pending', () => {
  it('disables itself, announces busy and keeps its label', () => {
    render(
      <Button variant="primary" pending disabled={false}>
        Créer le tracker
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Créer le tracker' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.querySelector('.mo-spinner')).not.toBeNull()
  })
})

describe('DataTable loading', () => {
  const columns = [
    { key: 'code', header: 'Code', cell: (row: { code: string }) => row.code, sortable: true },
    { key: 'qty', header: 'Qté', cell: () => 1, numeric: true },
  ]

  it('keeps the header, fills the body with skeleton rows and turns sorting off', () => {
    render(
      <DataTable
        rows={[]}
        columns={columns}
        rowKey={(row) => row.code}
        label="Outils"
        empty="Aucun outil"
        onSortChange={() => {}}
        loading
      />,
    )
    const table = screen.getByRole('table', { name: 'Outils' })
    const bodyRows = table.querySelectorAll('tbody tr')

    expect(table).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Code' })).toBeDisabled()
    expect(bodyRows).toHaveLength(3)
    expect(bodyRows[0].querySelectorAll('td .mo-skeleton')).toHaveLength(2)
    expect(screen.queryByText('Aucun outil')).toBeNull()
  })
})
