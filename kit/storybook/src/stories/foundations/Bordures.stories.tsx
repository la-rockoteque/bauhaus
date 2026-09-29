import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'
import './foundations.css'

const meta = {
  title: 'Fondations/Bordures & rayons',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Bordures: StoryObj = {
  name: 'Bordures & rayons',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Bordures & rayons"
      summary="Deux traits et quatre rayons. La bordure est l’arête du système — c’est elle qui sépare les surfaces, pas l’ombre : une carte a une bordure et aucune ombre. Le rayon encode la nature de l’élément plutôt que son importance, sur quatre échelons : 3 px pour une étiquette inline sans intérieur, 4 px pour ce que l’usager opère ou pour ce qui est encastré dans autre chose, 6 px pour un conteneur qui possède sa bordure et en contient d’autres, et la pilule pour une quantité ou un rail. C’est pourquoi une bannière est à 4 px et non à 6 : elle est dense et elle voisine un bouton."
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
          { n: 1, label: 'Bordure de carte', note: '1 px --mo-line', x: '-18px', y: '8px' },
          { n: 2, label: 'Rayon de carte', note: '--mo-radius-lg, 6 px', x: 'calc(100% + 18px)', y: '8px' },
          { n: 3, label: 'Rayon de pastille', note: '--mo-radius-sm, 3 px', x: 'calc(100% + 18px)', y: '66px' },
        ],
      }}
      specs={[
        { label: '--mo-line', value: 'la bordure par défaut — cartes, champs, en-têtes de tableau' },
        { label: '--mo-line-soft', value: 'un trait plus discret — séparateurs de lignes' },
        { label: 'Épaisseur', value: '1 px partout. Il n’y a pas de bordure de 2 px dans le système.' },
        { label: 'Rayon sm', value: '3 px — tags, chips, pastilles inline' },
        { label: 'Rayon md', value: '4 px — champs, boutons, bannières' },
        { label: 'Rayon lg', value: '6 px — cartes, HUD' },
        { label: 'Rayon pill', value: '999 px — rails de progression seulement' },
      ]}
      tokens={['--mo-line', '--mo-line-soft', '--mo-radius-sm', '--mo-radius-md', '--mo-radius-lg', '--mo-radius-pill']}
      extra={{
        title: 'Les quatre rayons',
        content: (
          <div className="fnd__radii">
            {(
              [
                ['sm', '3px', 'Tags, chips, pastilles'],
                ['md', '4px', 'Champs, boutons, bannières'],
                ['lg', '6px', 'Cartes, HUD'],
                ['pill', '999px', 'Rails de progression'],
              ] as [string, string, string][]
            ).map(([key, px, use]) => (
              <div className="fnd__radiusCell" key={key}>
                <div className="fnd__radiusSample" style={{ borderRadius: px }} />
                <code className="fnd__name">--mo-radius-{key}</code>
                <span className="fnd__usage">
                  {px} · {use}
                </span>
              </div>
            ))}
          </div>
        ),
      }}
      rules={{
        do: [
          'Employer les jetons de rayon : le rayon dit de quelle nature est l’élément.',
          'Séparer deux surfaces par une bordure, pas par une ombre.',
          'Garder --mo-radius-pill pour les rails de progression, nulle part ailleurs.',
        ],
        dont: [
          'Ne pas arrondir une carte à 12 px : le système s’arrête à 6.',
          'Ne pas mélanger deux rayons sur une même surface.',
          'Ne pas épaissir une bordure pour appuyer : c’est la couleur du trait qui porte, pas son épaisseur.',
        ],
      }}
    />
  ),
}
