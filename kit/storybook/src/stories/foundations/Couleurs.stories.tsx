import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocPage } from '../docs/DocPage'
import { Swatch } from './Swatch'
import { GROUPS } from './tokenSpecimens'
import './foundations.css'

const meta = {
  title: 'Fondations/Couleurs',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

export const Couleurs: StoryObj = {
  name: 'Couleurs',
  render: () => (
    <DocPage
      kind="Fondation"
      name="Couleurs"
      summary="Vingt-et-un jetons exposés en variables CSS sous le préfixe --mo-. Le système est monochrome par défaut — du navy et des gris — et ne sort la couleur que pour du sens : vert pour ce qui est prêt, ambre pour un avertissement ou une substitution, rouge pour une erreur. Il n’y a pas de cinquième couleur d’état, et c’est délibéré."
      usedOn="Toutes les pages · src/styles/design-system.css"
      anatomy={{
        render: (
          <div style={{ width: 212 }}>
            <Swatch token={GROUPS[3].tokens[0]} />
          </div>
        ),
        stageWidth: 380,
        parts: [
          { n: 1, label: 'Échantillon', note: 'la couleur appliquée, 76 px de haut', x: 'calc(100% + 18px)', y: '38px' },
          { n: 2, label: 'Nom du jeton', note: 'la variable à utiliser dans le CSS', x: '-18px', y: '96px' },
          { n: 3, label: 'Valeur', note: 'hexadécimal, pour Figma et les exports', x: '-18px', y: '120px' },
          { n: 4, label: 'Usage', note: 'où ce jeton s’applique dans le produit', x: '-18px', y: '146px' },
        ],
      }}
      specs={[
        { label: 'Préfixe', value: '--mo-' },
        { label: 'Nombre de jetons', value: '21 couleurs, réparties en 7 groupes' },
        { label: 'Marque', value: '--mo-primary #244b7b' },
        { label: 'Fond de page', value: '--mo-surface-soft #f5f7fa' },
        { label: 'Surface', value: '--mo-surface #ffffff' },
        { label: 'Prêt', value: 'texte #1e5a2c · fond #e4f4e5 · bordure #d2e7d8' },
        { label: 'Avertissement', value: 'texte #8a4c00 · encre #6a3900 · fond #fff3e0 · bordure #f0c98c' },
        { label: 'Erreur', value: 'texte #b33a3a · fond #fdecec · bordure #e7c7c7' },
        { label: 'Contraste', value: 'les quatre niveaux d’encre passent AA sur --mo-surface ; --mo-mute-soft mesure 3,02:1 et reste réservé au décoratif' },
      ]}
      extra={{
        title: 'Palette complète',
        content: (
          <>
            {GROUPS.map(({ group, tokens }) => (
              <section key={group} className="fnd__group">
                <h3 className="fnd__groupHead">{group}</h3>
                <div className="fnd__swatches">
                  {tokens.map((t) => (
                    <Swatch key={t.name} token={t} />
                  ))}
                </div>
              </section>
            ))}
          </>
        ),
      }}
      rules={{
        do: [
          'Utiliser la variable, jamais l’hexadécimal en dur : var(--mo-primary), pas #244b7b.',
          'Réserver le vert, l’ambre et le rouge au sens : prêt, avertissement, erreur.',
          'Doubler la couleur d’un libellé ou d’une icône quand elle porte une décision — un daltonien lit le texte.',
          'Passer par --mo-primary-tint pour une ligne sélectionnée : c’est le lavis le plus discret du système.',
        ],
        dont: [
          'Ne pas ajouter une cinquième couleur d’état. Prêt / avertissement / erreur / neutre est la palette.',
          'Ne pas employer une couleur de statut pour un état actif ou sélectionné — c’est --mo-primary ou un changement de fond.',
          'Ne pas poser --mo-mute-soft sur du texte qu’il faut lire : 3,02:1, sous le seuil AA de 4,5:1.',
          'Ne pas empiler trois couches visuelles (bordure + fond teinté + bande d’accent épaisse). Deux suffisent.',
        ],
      }}
    />
  ),
}

/* ------------------------------------------------------------------ */
/* Typographie                                                         */
/* ------------------------------------------------------------------ */
