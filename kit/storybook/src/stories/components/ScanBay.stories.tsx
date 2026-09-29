import { ScanLine } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Kicker, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

/**
 * TM-93 — the third primitive the stylesheet declared and no page showed.
 *
 * `mo-scan` is the largest of the four orphans and the one most worth keeping:
 * it encodes a set of decisions about a physical scanner — a 48 px target, a
 * monospace value, an icon that never intercepts the tap — that would otherwise
 * be re-derived by whoever next builds a scanning screen.
 */
const meta = {
  title: 'Composants/Champs/Poste de scan',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

function ScanBay({
  value,
  hint = 'Douchette ou saisie manuelle',
  tag,
}: {
  value?: string
  hint?: string
  tag?: 'ready' | 'amber'
}) {
  return (
    <div className="mo-scan" style={{ width: 460 }}>
      <div className="mo-scan-head">
        <Kicker>Scan d’outil</Kicker>
        {tag ? (
          <Tag tone={tag === 'ready' ? 'soft-ready' : 'soft-amber'}>
            {tag === 'ready' ? 'Reconnu' : 'Substitution'}
          </Tag>
        ) : (
          <span className="mo-scan-hint">{hint}</span>
        )}
      </div>
      <div className="mo-scan-field">
        <ScanLine className="mo-scan-icon" size={18} aria-hidden="true" />
        <input
          className="mo-scan-input"
          placeholder="Scanner un numéro de série"
          defaultValue={value}
          aria-label="Numéro de série"
        />
        <Button variant="primary">Ajouter</Button>
      </div>
    </div>
  )
}

export const Guidelines: StoryObj = {
  name: 'Poste de scan',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Poste de scan"
      summary="Le bloc qui reçoit une douchette : un sur-titre, un indice à droite, puis un champ de 48 px avec l’icône posée dedans et le bouton d’ajout collé à côté. La valeur est en monospace parce qu’un numéro de série s’épelle caractère par caractère quand il faut le vérifier à l’œil, et le champ est haut parce que la saisie de secours se fait au doigt, ganté, debout."
      usedOn="Aucun appelant aujourd’hui — la primitive attend le prochain écran de scan"
      anatomy={{
        render: <ScanBay />,
        stageWidth: 620,
        parts: [
          { n: 1, label: 'Sur-titre', note: '.mo-kicker — ce que le poste attend', x: '-18px', y: '18px' },
          { n: 2, label: 'Indice', note: '.mo-scan-hint, ou un tag de résultat', x: 'calc(100% + 18px)', y: '18px' },
          { n: 3, label: 'Icône', note: 'absolue, pointer-events: none', x: '-18px', y: '74px' },
          { n: 4, label: 'Champ', note: '48 px de haut, monospace, --mo-text-lg', x: '50%', y: 'calc(100% + 18px)' },
          { n: 5, label: 'Action', note: 'un bouton primaire, à la hauteur du champ', x: 'calc(100% + 18px)', y: '74px' },
        ],
      }}
      specs={[
        { label: 'Bloc', value: 'bordure --mo-line · rayon --mo-radius-lg · fond --mo-surface' },
        { label: 'Gouttière', value: '12 px en haut, 16 px sur les côtés et en bas' },
        { label: 'Champ', value: '48 px de haut · monospace · --mo-text-lg · retrait gauche de 44 px pour l’icône' },
        { label: 'Icône', value: 'absolue à 14 px, centrée verticalement, pointer-events: none' },
        { label: 'Indicatif', value: 'le placeholder repasse en --mo-font-body et --mo-text-md — c’est une consigne, pas une valeur' },
        { label: 'Focus', value: 'bordure --mo-primary + anneau de 3 px --mo-primary-soft' },
        { label: 'Mobile', value: 'le champ passe à 16 px sous 768 px pour empêcher le zoom iOS' },
      ]}
      tokens={['--mo-line', '--mo-surface', '--mo-primary', '--mo-primary-soft', '--mo-mute-soft', '--mo-ink', '--mo-font-mono']}
      states={[
        { render: <ScanBay />, label: 'Vide', trigger: '.mo-scan', note: 'L’indice dit comment alimenter le champ.' },
        { render: <ScanBay value="CM-23904" tag="ready" />, label: 'Reconnu', trigger: 'tag « Reconnu »' },
        { render: <ScanBay value="CM-88120" tag="amber" />, label: 'Substitution', trigger: 'tag « Substitution »' },
        {
          render: (
            <div className="mo-scan" style={{ width: 460 }}>
              <div className="mo-scan-head">
                <Kicker>Scan d’outil</Kicker>
                <span className="mo-scan-hint">Douchette ou saisie manuelle</span>
              </div>
              <div className="mo-scan-field">
                <ScanLine className="mo-scan-icon" size={18} aria-hidden="true" />
                <input className="mo-scan-input" defaultValue="CM-00000" aria-label="Numéro de série" />
                <Button variant="primary">Ajouter</Button>
              </div>
              <span className="mo-error-text" style={{ marginTop: 'var(--mo-space-2)', display: 'block' }}>
                Ce numéro n’appartient à aucune ligne de cette réquisition.
              </span>
            </div>
          ),
          label: 'Refusé',
          trigger: '.mo-error-text',
          note: 'Le message se pose sous le champ ; le poste ne change pas de couleur.',
        },
        {
          render: (
            <span className="demo-focus">
              <ScanBay />
            </span>
          ),
          label: 'Focus clavier',
          trigger: ':focus',
          note: 'Reproduit par .demo-focus — la vraie règle vit dans design-system.css.',
        },
      ]}
      rules={{
        do: [
          'Garder le champ au premier plan du bloc : c’est la seule chose que le poste existe pour recevoir.',
          'Laisser la saisie manuelle possible — une douchette tombe en panne, et l’étiquette s’abîme.',
          'Rendre le résultat du dernier scan visible dans l’en-tête, en tag, plutôt que dans une alerte qui bouge.',
          'Poser l’erreur sous le champ, en .mo-error-text, sans recolorer le bloc.',
        ],
        dont: [
          'Ne pas rétrécir le champ sous 48 px : la saisie de secours se fait avec des gants.',
          'Ne pas donner d’événement à l’icône — elle est décorative et pointer-events: none le dit.',
          'Ne pas mettre la consigne dans le placeholder seul : il disparaît dès la première frappe, l’indice reste.',
          'Ne pas empiler deux postes de scan sur un écran : lequel a le focus devient une devinette.',
        ],
      }}
    />
  ),
}
