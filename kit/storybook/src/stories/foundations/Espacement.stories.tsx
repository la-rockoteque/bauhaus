import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'
import { SPACING } from './tokenSpecimens'
import './foundations.css'

const meta = {
  title: 'Fondations/Espacement',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Espacement: StoryObj = {
  name: 'Espacement',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Espacement"
      summary="Un rythme de 4 px sur huit échelons. Sauter 6, 10 et 14 n’est pas un oubli : c’est la contrainte qui force l’alignement. Un écart pris au jugé se voit dès qu’il voisine un écart pris dans l’échelle."
      usedOn="Toutes les pages"
      anatomy={{
        render: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)', width: 300 }}>
            <div className="mo-card" style={{ padding: 'var(--mo-space-4)' }}>
              <span className="mo-kicker">Actifs liés</span>
              <div style={{ marginTop: 'var(--mo-space-2)', display: 'flex', gap: 'var(--mo-space-2)' }}>
                <span className="mo-chip">Hilti TE 30</span>
                <span className="mo-tag mo-tag--soft-ready">Prêt</span>
              </div>
            </div>
          </div>
        ),
        stageWidth: 470,
        parts: [
          { n: 1, label: 'Gouttière de carte', note: '--mo-space-4, 16 px', x: '-18px', y: '24px' },
          { n: 2, label: 'Écart interne', note: '--mo-space-2, 8 px', x: '-18px', y: '62px' },
        ],
      }}
      specs={[
        { label: 'Rythme', value: '4 px' },
        { label: 'Échelle', value: '4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 px' },
        { label: 'Échelons absents', value: '6 · 10 · 14 — délibérément' },
        { label: 'Hauteur de bouton', value: '38 px, 32 px en --sm' },
        { label: 'Hauteur de champ', value: '40 px (--form-input-height, jeu legacy)' },
      ]}
      extra={{
        title: 'L’échelle',
        content: (
          <section className="fnd__scale">
            {SPACING.map(([token, n]) => (
              <div className="fnd__scaleRow" key={token}>
                <code className="fnd__name">{token}</code>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="fnd__bar" style={{ width: n }} />
                  <span className="fnd__usage">{n} px</span>
                </div>
              </div>
            ))}
          </section>
        ),
      }}
      rules={{
        do: [
          'Prendre les écarts dans l’échelle plutôt qu’au jugé.',
          'Se servir des jetons d’espacement là où la cohérence entre composants compte ; des valeurs explicites pour la mise en page interne d’un composant restent acceptables.',
        ],
        dont: [
          'Ne pas inventer un 6, un 10 ou un 14 px — l’échelon absent est le garde-fou.',
          'Ne pas remplacer une marge par un <br> ou une ligne vide.',
        ],
      }}
    />
  ),
}
