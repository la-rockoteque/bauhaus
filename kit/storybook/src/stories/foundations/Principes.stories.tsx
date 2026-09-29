import type { Meta, StoryObj } from '@storybook/react-vite'
import './foundations.css'

const meta = {
  title: 'Principes',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

export const Principes: StoryObj = {
  name: 'Principes',
  render: () => (
    <div className="fnd">
      <p className="doc__eyebrow">MoShip · Système de design</p>
      <h1 className="mo-page-title mo-page-title--lg">MoShip</h1>
      <p className="fnd__lede">
        MoShip est un outil interne de cour et d’entrepôt. Le public, ce sont des surintendants
        de chantier, des préparateurs et du personnel d’expédition — des gens qui lisent un écran
        entre deux tâches physiques. L’interface doit se comporter comme un instrument fiable :
        hiérarchie claire, ornement retenu, statut lisible d’un coup d’œil. Ennuyeuse, au meilleur
        sens du terme.
      </p>
      <div className="fnd__grid2">
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">Retenue plutôt que décoration</h2>
          <p className="fnd__panelText">
            Pas de dégradé, pas de halo, pas d’empilement d’ombres internes, pas de libellé en
            majuscules à l’interlettrage étiré. Les bordures, les surfaces et une seule couleur
            de statut font tout le travail. Si une primitive a besoin d’ornement pour se lire,
            c’est la primitive qui est fautive.
          </p>
        </section>
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">Une famille, deux voix</h2>
          <p className="fnd__panelText">
            IBM Plex Sans pour tout ce qui se lit — prose, libellés, boutons, titres. IBM Plex
            Mono pour tout ce qui se balaie — identifiants, numéros de série, codes scannés,
            quantités. La répétition est la discipline : la cohérence vient de la contrainte,
            pas de la variété.
          </p>
        </section>
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">La couleur porte le statut</h2>
          <p className="fnd__panelText">
            Prêt = vert, avertissement ou substitution = ambre, erreur = rouge, marque = navy.
            La couleur est rare, donc elle atterrit. On ne s’en sert pas pour « rendre un bouton
            important » ni pour marquer un élément de menu actif — c’est le rôle du fond, de la
            graisse et du navy de marque.
          </p>
        </section>
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">Densité et respiration</h2>
          <p className="fnd__panelText">
            La quantité d’information par écran est élevée — c’est de l’opération, pas du
            marketing — mais l’échelle typographique et l’espacement gagnent du blanc à la bonne
            granularité. Des blocs distincts, une hiérarchie nette, l’œil se pose.
          </p>
        </section>
      </div>

      <div className="fnd__grid2">
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">Où vit quoi</h2>
          <p className="fnd__panelText">
            Les jetons et les primitives <code className="fnd__name">.mo-*</code> vivent dans{' '}
            <code className="fnd__name">src/styles/design-system.css</code> — c’est la source de
            vérité visuelle. La bibliothèque React qui les habille vit dans{' '}
            <code className="fnd__name">src/components/ui/</code> et ne porte aucun CSS. Le guide
            en prose est <code className="fnd__name">docs/guides/design-system.md</code>.
          </p>
        </section>
        <section className="fnd__panel">
          <h2 className="fnd__groupHead">Ajouter une primitive</h2>
          <p className="fnd__panelText">
            Trois conditions, avant d’écrire une classe <code className="fnd__name">.mo-*</code> :
            le motif apparaît à deux endroits au moins, il est structurel et non incident, et il a
            un seul rôle clair. Cinq modificateurs pour cinq cas sans rapport, c’est deux
            primitives qui n’ont pas encore été séparées.
          </p>
        </section>
      </div>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* Couleurs                                                            */
/* ------------------------------------------------------------------ */
