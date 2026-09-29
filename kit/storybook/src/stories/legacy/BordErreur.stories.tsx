import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LegacyPage } from './LegacyPage'

/**
 * TM-94 — the last stop before a white screen.
 *
 * One component, one stylesheet, and the only surface in the repo a user reaches
 * by accident. It mounts live here, caught state included: `Boom` throws during
 * render and the boundary does its job. React logs the error twice — its own and
 * the dev double-invoke — which is expected on this page and not a failure.
 */
const meta = {
  title: 'Composants/Données/Bord d’erreur',
  parameters: { layout: 'fullscreen' },
} satisfies Meta
export default meta

/** Throws during render, which is the only way to show a boundary doing its work. */
function Boom(): never {
  throw new Error('Démonstration : un composant a échoué au rendu.')
}

export const Guidelines: StoryObj = {
  name: 'Bord d’erreur',
  render: () => (
    <LegacyPage
      name="Bord d’erreur"
      prefixes={['src/components/ErrorBoundary/']}
      summary="Le filet sous l’application. Tant que rien ne casse, il rend ses enfants et ne se voit pas ; quand un rendu lève, il attrape, journalise, et remplace l’écran par un titre, une phrase et un bouton qui recharge. C’est la seule surface du produit qu’un utilisateur atteint par accident, et la seule qui doive se rendre alors même que ce qui l’entoure vient d’échouer."
      usedOn="Autour du routeur, dans main.tsx"
      anatomy={{
        render: (
          <div style={{ width: 460 }}>
            <ErrorBoundary>
              <Boom />
            </ErrorBoundary>
          </div>
        ),
        stageWidth: 620,
        parts: [
          { n: 1, label: 'Titre', note: 'ce qui est arrivé, en une ligne', x: '-18px', y: '18px' },
          { n: 2, label: 'Phrase', note: 'ce que la personne peut faire', x: '-18px', y: '54px' },
          { n: 3, label: 'Bouton', note: '.error-boundary-btn — recharge la page', x: 'calc(100% + 18px)', y: '92px' },
        ],
      }}
      specs={[
        { label: 'Forme', value: 'composant de classe — componentDidCatch n’a pas d’équivalent en hook' },
        { label: 'i18n', value: 'withTranslation(["nav", "common"]) — un HOC, pas un hook' },
        { label: 'Au repos', value: 'rend ses enfants tels quels ; .error-boundary n’existe pas dans le DOM' },
        { label: 'Attrapé', value: 'remplace tout le sous-arbre par le bloc d’erreur' },
        { label: 'Journalisation', value: 'console.error dans componentDidCatch' },
        { label: 'Reprise', value: 'window.location.reload() — l’état de la page est déjà suspect' },
        { label: 'Portée', value: 'le rendu seulement. Ni promesse rejetée, ni erreur de gestionnaire d’événement' },
      ]}
      states={[
        {
          render: (
            <div style={{ padding: 'var(--mo-space-3)', border: '1px dashed var(--mo-line)', borderRadius: 'var(--mo-radius-md)' }}>
              <ErrorBoundary>
                <p style={{ fontSize: 'var(--mo-text-md)', color: 'var(--mo-ink-soft)', margin: 0 }}>
                  Contenu normal — le bord ne se voit pas.
                </p>
              </ErrorBoundary>
            </div>
          ),
          label: 'Au repos',
          trigger: 'aucune erreur',
          note: 'Le cadre pointillé est celui de la démonstration : le bord lui-même ne rend rien autour de ses enfants.',
        },
        {
          render: (
            <div style={{ width: 420 }}>
              <ErrorBoundary>
                <Boom />
              </ErrorBoundary>
            </div>
          ),
          label: 'Attrapé',
          trigger: 'un enfant lève au rendu',
          note: 'React journalise deux fois — sa propre trace et le double rendu du mode développement. C’est attendu ici.',
        },
      ]}
      target={
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--mo-space-3)' }}>
          <p>
            <strong>Une seule feuille, et une règle particulière : elle doit survivre à la panne.</strong>{' '}
            Le bord se rend précisément quand quelque chose vient de casser, donc son style ne peut
            dépendre de rien qui puisse manquer. En pratique cela ne change pas la cible —{' '}
            <code>--mo-*</code> vit dans <code>design-system.css</code>, importé par{' '}
            <code>index.css</code> comme le jeu legacy — mais c’est la raison de ne pas lui donner
            de composant qui ferait des requêtes.
          </p>
          <p>
            La composition existe déjà : <code>&lt;EmptyState&gt;</code> porte exactement ce
            gabarit — un titre, un corps, une action — et <code>&lt;Button variant=&quot;primary&quot;&gt;</code>{' '}
            le bouton de reprise. Le bloc entier se réécrit avec les deux, et{' '}
            <code>ErrorBoundary.css</code> disparaît.
          </p>
          <p>
            <strong>Ce que la migration ne doit pas emporter</strong>, c’est la forme de classe :{' '}
            <code>componentDidCatch</code> n’a pas d’équivalent en hook, et remplacer le composant
            par une version fonctionnelle retirerait le filet. Le style change, la mécanique reste.
          </p>
        </div>
      }
      specimen={{ title: 'Erreur attrapée', content: (
<ErrorBoundary>
            <Boom />
          </ErrorBoundary>
        ) }}
      rules={{
        do: [
          'Garder le message en deux temps : ce qui est arrivé, puis ce que la personne peut faire.',
          'Laisser la reprise recharger la page — après un rendu qui a levé, l’état en mémoire n’est plus fiable.',
          'Journaliser l’erreur avec sa pile : c’est la seule trace qui reste de cet écran.',
          'Garder le composant de classe : c’est ce qui permet d’attraper.',
        ],
        dont: [
          'Ne pas y afficher la pile ni le message brut : la personne devant l’écran n’en fait rien.',
          'Ne pas compter dessus pour une promesse rejetée ou une erreur de gestionnaire — il ne voit que le rendu.',
          'Ne pas faire dépendre son style de quoi que ce soit qui puisse manquer au moment de la panne.',
          'Ne pas emballer chaque écran dans son propre bord : un filet par application, au-dessus du routeur.',
        ],
      }}
    />
  ),
}
