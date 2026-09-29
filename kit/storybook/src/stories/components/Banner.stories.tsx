import type { Meta, StoryObj } from '@storybook/react-vite'
import { Banner, Tag } from '../../components/ui'
import { DocPage } from '../docs/DocPage'

const meta = {
  title: 'Composants/Bannière',
  component: Banner,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Banner>
export default meta

export const Guidelines: StoryObj = {
  name: 'Bannière',
  render: () => (
    <DocPage
      kind="Primitive"
      name="Bannière"
      primitive="Banner"
      summary="Un bloc d’attention qui explique un état avant que l’utilisateur ne s’engage : une substitution qui va être marquée comme telle, une quantité qui dépasse le restant. Elle se pose au-dessus de ce qu’elle qualifie — des résultats de recherche, un panier — et elle reste tant que la condition est vraie."
      usedOn="9 fichiers · paniers de préparation, formulaires de réquisition"
      anatomy={{
        render: (
          <Banner tone="amber" style={{ width: 420 }}>
            <Tag tone="amber">Substitution</Tag>
            Les actifs sélectionnés seront marqués comme substitution.
          </Banner>
        ),
        stageWidth: 560,
        parts: [
          { n: 1, label: 'Tag de qualification', note: 'optionnel — nomme la condition', x: '-18px', y: '28px' },
          { n: 2, label: 'Phrase', note: 'ce qui va se passer, au futur', x: 'calc(100% + 18px)', y: '28px' },
          { n: 3, label: 'Ton', note: 'la couleur du fond et de la bordure', x: '50%', y: 'calc(100% + 18px)' },
        ],
      }}
      specs={[
        { label: 'Rayon', value: '--mo-radius-md, 4 px' },
        { label: 'Taille de texte', value: '--mo-text-md, 14 px' },
        { label: 'Ton neutre', value: '--mo-surface-soft' },
        { label: 'Ton ambre', value: 'fond --mo-amber-soft, bordure --mo-amber-line' },
        { label: 'Ton erreur', value: 'fond --mo-error-soft, bordure --mo-error-line' },
        { label: 'Ton prêt', value: 'fond --mo-ready-soft, bordure --mo-ready-line' },
        { label: 'Rôle ARIA', value: 'role="status" sur tous les tons, y compris erreur' },
      ]}
      tokens={['--mo-surface-soft', '--mo-amber-soft', '--mo-amber-line', '--mo-error-soft', '--mo-error-line', '--mo-ready-soft', '--mo-ready-line']}
      api={[
        { label: 'tone', value: '"amber" | "error" | "ready" — omis pour la bannière neutre.' },
        { label: 'role', value: 'Défaut "status". Une bannière décrit une situation qu’on regarde ; elle ne doit pas couper un lecteur d’écran en pleine phrase comme le ferait "alert".' },
        { label: '…props', value: 'Attributs natifs de <div>.' },
      ]}
      states={[
        { render: <Banner style={{ width: 260 }}>Aucune substitution en cours.</Banner>, label: 'Neutre', trigger: 'tone omis' },
        { render: <Banner tone="ready" style={{ width: 260 }}>Toutes les lignes sont prêtes.</Banner>, label: 'Prêt', trigger: 'tone="ready"' },
        {
          render: (
            <Banner tone="amber" style={{ width: 260 }}>
              <Tag tone="amber">Substitution</Tag>
              Les actifs seront marqués comme substitution.
            </Banner>
          ),
          label: 'Avertissement',
          trigger: 'tone="amber"',
        },
        { render: <Banner tone="error" style={{ width: 260 }}>La quantité liée (5) dépasse le restant (3).</Banner>, label: 'Erreur', trigger: 'tone="error"' },
      ]}
      rules={{
        do: [
          'Écrire ce qui va se passer, pas ce qui est interdit : « seront marqués comme substitution ».',
          'Poser la bannière au-dessus de ce qu’elle qualifie, pas en haut de page.',
          'La retirer dès que la condition cesse d’être vraie.',
          'Ajouter un tag quand la condition a un nom que le produit emploie déjà.',
        ],
        dont: [
          'Ne pas empiler deux bannières : la seconde ne sera pas lue.',
          'Ne pas s’en servir pour une erreur de champ — ça va sous le champ, en mo-error-text.',
          'Ne pas y mettre l’action principale : elle reste dans le pied du panneau.',
          'Ne pas laisser une bannière neutre expliquer un état normal — le silence est l’état normal.',
        ],
      }}
    />
  ),
}
