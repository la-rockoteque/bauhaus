import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'
import './foundations.css'

const meta = {
  title: 'Fondations/Élévation & ombres',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Elevation: StoryObj = {
  name: 'Élévation & ombres',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Élévation & ombres"
      summary="Deux échelons d’ombre. Les cartes n’ont pas d’ombre : leur bordure est leur arête. L’ombre est réservée à ce qui flotte vraiment au-dessus du canevas — un menu, une modale. L’élévation est sémantique ; le z-index n’est que sa mise en œuvre. Pour les durées et les courbes, voir Fondations/Mouvement."
      usedOn="Menus flottants, listes déroulantes, infobulles, modales, tiroirs"
      specs={[
        { label: '--mo-shadow-1', value: 'menus flottants, listes déroulantes, infobulles' },
        { label: '--mo-shadow-2', value: 'modales, tiroirs, superpositions plein écran' },
        { label: 'Cartes', value: 'aucune ombre — la bordure est l’arête' },
      ]}
      extra={{
        title: 'Les deux échelons',
        content: (
          <div className="fnd__elevations">
            <div className="fnd__elevationCell">
              <div className="fnd__elevationSample" />
              <code className="fnd__name">aucune ombre</code>
              <span className="fnd__usage">Cartes, sections, tableaux</span>
            </div>
            <div className="fnd__elevationCell">
              <div className="fnd__elevationSample" style={{ boxShadow: 'var(--mo-shadow-1)' }} />
              <code className="fnd__name">--mo-shadow-1</code>
              <span className="fnd__usage">Menus, listes déroulantes, infobulles</span>
            </div>
            <div className="fnd__elevationCell">
              <div className="fnd__elevationSample" style={{ boxShadow: 'var(--mo-shadow-2)' }} />
              <code className="fnd__name">--mo-shadow-2</code>
              <span className="fnd__usage">Modales, tiroirs, superpositions</span>
            </div>
          </div>
        ),
      }}
      rules={{
        do: [
          'Réserver l’ombre à ce qui flotte réellement au-dessus du contenu.',
          'Laisser la bordure faire l’arête d’une carte.',
        ],
        dont: [
          'Ne pas poser d’ombre sur une carte : bordure et ombre ensemble, c’est la couche de trop.',
          'Ne pas empiler plusieurs ombres internes ni ajouter un halo.',
          'Ne pas ajouter un troisième échelon d’élévation.',
        ],
      }}
    />
  ),
}
