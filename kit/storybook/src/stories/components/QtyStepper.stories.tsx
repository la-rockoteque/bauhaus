import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'

/**
 * TM-93 — the second of the four primitives no page showed.
 *
 * Like the counter, `mo-qty` has no wrapper and no adopter: it belongs to the
 * prep screens that were reworked. It stays because a gloved hand on a warehouse
 * tablet needs a target bigger than a spinner arrow, and that is a decision worth
 * keeping rather than rediscovering.
 */
const meta = {
  title: 'Composants/Champs/Sélecteur de quantité',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function Qty({ value = 3, disabled }: { value?: number; disabled?: boolean }) {
  const [qty, setQty] = useState(value)

  return (
    <div className="mo-qty">
      <button
        type="button"
        className="mo-qty-btn"
        onClick={() => setQty((n) => Math.max(0, n - 1))}
        disabled={disabled}
        aria-label="Retirer un"
      >
        −
      </button>
      <input
        type="number"
        className="mo-qty-input"
        value={qty}
        disabled={disabled}
        onChange={(e) => setQty(Number(e.target.value))}
        aria-label="Quantité"
      />
      <button
        type="button"
        className="mo-qty-btn"
        onClick={() => setQty((n) => n + 1)}
        disabled={disabled}
        aria-label="Ajouter un"
      >
        +
      </button>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Sélecteur de quantité',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Sélecteur de quantité"
      summary="Moins, un nombre, plus — dans une seule boîte bordée. Il existe parce que le public est un préparateur avec des gants sur une tablette : les flèches natives d’un <input type=number> font 8 px de haut et se ratent, alors que ces deux boutons font 28 px de large sur toute la hauteur du champ. La saisie au clavier reste possible pour les quantités qu’on ne veut pas atteindre à coups de +."
      usedOn="Aucun appelant aujourd’hui — la primitive attend les écrans de préparation"
      anatomy={{
        render: <Qty />,
        stageWidth: 420,
        parts: [
          { n: 1, label: 'Retrait', note: '28 px, fond --mo-surface-soft', x: '-18px', y: '50%' },
          { n: 2, label: 'Champ', note: '46 px, monospace, chiffres tabulaires', x: '50%', y: 'calc(100% + 18px)' },
          { n: 3, label: 'Ajout', note: 'même gabarit que le retrait', x: 'calc(100% + 18px)', y: '50%' },
          { n: 4, label: 'Bordure', note: 'une seule, sur le groupe — pas trois', x: '50%', y: '-18px' },
        ],
      }}
      specs={[
        { label: 'Bouton', value: '28 px de large, pleine hauteur · fond --mo-surface-soft · encre --mo-primary' },
        { label: 'Survol du bouton', value: '#e1e9f3 — une valeur en dur, la seule de la primitive' },
        { label: 'Champ', value: '46 px · --mo-font-md · semibold · monospace · centré' },
        { label: 'Bordure', value: '1 px --mo-line sur le groupe, plus deux séparateurs internes' },
        { label: 'Rayon', value: '--mo-radius-md, 4 px, avec overflow: hidden pour les coins' },
        { label: 'Flèches natives', value: 'retirées — -moz-appearance: textfield et ::-webkit-*-spin-button' },
        { label: 'Focus', value: 'contour de 2 px --mo-primary en offset -2, donc à l’intérieur du groupe' },
      ]}
      tokens={['--mo-line', '--mo-surface', '--mo-surface-soft', '--mo-primary', '--mo-ink-soft', '--mo-font-mono']}
      states={[
        { render: <Qty />, label: 'Au repos', trigger: '.mo-qty' },
        { render: <Qty value={0} />, label: 'À zéro', trigger: 'value=0', note: 'Le retrait ne descend pas sous zéro.' },
        { render: <Qty value={148} />, label: 'Quantité longue', trigger: 'tabular-nums' },
        { render: <Qty disabled />, label: 'Désactivé', trigger: 'disabled', note: 'Les trois éléments ensemble — un champ à moitié actif ment sur ce qui est modifiable.' },
        {
          render: (
            <span className="demo-focus">
              <Qty />
            </span>
          ),
          label: 'Focus clavier',
          trigger: ':focus',
          note: 'Le contour est en offset négatif : il se dessine dans la bordure du groupe.',
        },
      ]}
      rules={{
        do: [
          'Laisser le champ modifiable au clavier : personne ne clique vingt fois sur +.',
          'Nommer les deux boutons pour l’assistance — « Ajouter un », « Retirer un ».',
          'Borner la valeur dans le gestionnaire plutôt que de masquer le bouton : un bouton qui disparaît déplace la mise en page sous le doigt.',
          'Désactiver les trois éléments ensemble quand la ligne est verrouillée.',
        ],
        dont: [
          'Ne pas s’en servir pour une valeur qui n’est pas un décompte — une date, un pourcentage, un choix.',
          'Ne pas rétablir les flèches natives : elles sont retirées exprès, elles se ratent avec des gants.',
          'Ne pas rétrécir les boutons sous 28 px pour gagner de la place dans un tableau.',
          'Ne pas empiler un libellé dans le groupe : il va dans .mo-field-label au-dessus.',
        ],
      }}
    />
  ),
}
