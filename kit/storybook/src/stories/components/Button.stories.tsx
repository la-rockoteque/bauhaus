import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Bouton',
  component: Button,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Button>
export default meta

type Story = StoryObj<typeof meta>

export const Guidelines: Story = {
  name: 'Bouton',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Bouton"
      primitive="Button"
      summary="Le bouton du système, en deux variantes seulement. Le primaire est plein navy et il y en a un seul par région : c’est l’action que la page existe pour déclencher. Tout le reste est ghost — bordé, fond blanc. Il n’y a pas de variante destructrice : une suppression se distingue par son libellé et sa confirmation, pas par du rouge."
      usedOn="43 fichiers · c’est la primitive la plus employée du système"
      anatomy={{
        render: <Button variant="primary" badge={3}>Confirmer la préparation</Button>,
        stageWidth: 460,
        parts: [
          { n: 1, label: 'Libellé', note: 'un verbe à l’infinitif, jamais « OK »', x: '-18px', y: '50%' },
          { n: 2, label: 'Pastille de décompte', note: 'prop badge, sur le primaire seulement', x: 'calc(100% + 18px)', y: '50%' },
          { n: 3, label: 'Hauteur', note: '38 px, 32 px en size="sm"', x: '50%', y: '-18px' },
          { n: 4, label: 'Rayon', note: '--mo-radius-md, 4 px', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Hauteur', value: '38 px · 32 px en --sm' },
        { label: 'Rayon', value: '--mo-radius-md, 4 px' },
        { label: 'Taille de texte', value: '--mo-text-md, 14 px' },
        { label: 'Primaire', value: 'fond --mo-primary, survol --mo-primary-ink' },
        { label: 'Ghost', value: 'fond --mo-surface, bordure --mo-line, survol --mo-surface-soft' },
        { label: 'Désactivé', value: 'fond #adb5bd sur le primaire ; le ghost perd son encre' },
        { label: 'Focus', value: 'anneau de 3 px en --mo-primary-soft, via :focus-visible' },
        { label: 'Pastille', value: '20 px de haut, fond blanc à 18 % — primaire seulement' },
        { label: 'type', value: 'défaut "button" — le défaut HTML "submit" soumet le formulaire par accident' },
      ]}
      tokens={['--mo-primary', '--mo-primary-ink', '--mo-primary-soft', '--mo-surface', '--mo-surface-soft', '--mo-line']}
      api={[
        { label: 'variant', value: '"primary" | "ghost" — défaut "ghost". Un seul primaire par région.' },
        { label: 'size', value: '"md" | "sm" — défaut "md". Le sm sert dans une ligne de tableau ou une barre d’outils.' },
        { label: 'badge', value: 'ReactNode — pastille de décompte inline. N’apparaît que si la valeur est définie ; badge={0} s’affiche donc bien.' },
        { label: 'pending', value: 'L’action tourne : le bouton se désactive, annonce aria-busy et pose un spinner devant son libellé, qui ne bouge pas. Il garde sa teinte — ce n’est pas « indisponible ».' },
        { label: 'type', value: 'Hérité de <button>, forcé à "button" par défaut.' },
        { label: '…props', value: 'Tous les attributs natifs de <button>, plus la ref.' },
      ]}
      states={[
        { render: <Button variant="primary">Confirmer</Button>, label: 'Primaire', trigger: 'variant="primary"' },
        { render: <Button>Annuler</Button>, label: 'Ghost', trigger: 'variant="ghost"' },
        { render: <Button variant="primary" size="sm">Enregistrer</Button>, label: 'Primaire compact', trigger: 'size="sm"' },
        { render: <Button variant="primary" disabled>Confirmer</Button>, label: 'Désactivé', trigger: 'disabled' },
        { render: <Button disabled>Annuler</Button>, label: 'Ghost désactivé', trigger: 'disabled' },
        {
          render: <span className="demo-focus"><Button variant="primary">Confirmer</Button></span>,
          label: 'Focus clavier',
          trigger: ':focus-visible',
          note: 'Reproduit par .demo-focus — la vraie règle vit dans design-system.css.',
        },
        { render: <Button variant="primary" badge={3}>Préparer</Button>, label: 'Avec décompte', trigger: 'badge={3}' },
        { render: <Button variant="primary" pending>Créer le tracker</Button>, label: 'En cours', trigger: 'pending' },
        { render: <Button pending>Exporter</Button>, label: 'Ghost en cours', trigger: 'pending' },
      ]}
      rules={{
        do: [
          'Un seul bouton primaire par région : c’est lui qui dit ce que la page attend.',
          'Écrire un verbe qui nomme l’effet — « Confirmer la préparation », pas « OK ».',
          'Mettre le décompte dans badge plutôt que dans le libellé, pour qu’il reste alignable.',
          'Laisser type="button" par défaut, sauf pour le bouton qui soumet vraiment le formulaire.',
        ],
        dont: [
          'Ne pas aligner deux primaires côte à côte — le second devient ghost.',
          'Ne pas colorer un bouton en rouge pour une suppression : le libellé et la confirmation portent le risque.',
          'Ne pas désactiver un bouton sans dire pourquoi ailleurs à l’écran.',
          'Ne jamais laisser une action cliquable pendant qu’elle tourne : pending sur celle qui a été lancée.',
          'Ne pas remplacer un lien de navigation par un bouton stylé en lien.',
        ],
      }}
    />
  ),
}
