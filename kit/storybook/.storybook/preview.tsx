import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

// index.css pulls design-system.css in first, so one import gives a story both
// the --mo-* tokens and the legacy --color-* set the older components still read.
import '../src/index.css'
import i18n, { DEFAULT_LOCALE, i18nReady } from '../src/i18n'
import { DevOverlay } from '../src/devOverlay/DevOverlay'
import { moflexTheme } from './theme'

// Mirrors createTestQueryClient() in src/test/render.tsx: no retries, no cache.
// A story that fails to fetch should say so at once rather than spin three times.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0, staleTime: 0 },
    mutations: { retry: false },
  },
})

/**
 * `region` asks that all content sit inside a landmark. A Storybook story renders bare by
 * design, so the rule fires on every cell of every page — 24 of them on the Bouton page
 * alone — and buries the findings that are actually about the component.
 */
const STORYBOOK_NOISE = ['region']

const preview: Preview = {
  // Components call useTranslation() unconditionally, so the bundle has to be
  // loaded before the first render — same bootstrap as src/test/setup.ts.
  loaders: [
    async () => {
      await i18nReady
      await i18n.changeLanguage(DEFAULT_LOCALE)
      return {}
    },
  ],
  decorators: [
    // The overlay is mounted unconditionally here, without the feature flag the app
    // gates it behind: Storybook IS the design system's review surface, so a finding
    // about a primitive belongs on the primitive's own page. It starts collapsed and
    // remembers its own state — see src/devOverlay/usePreferences.ts.
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
          <DevOverlay disabledRules={STORYBOOK_NOISE} />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    backgrounds: { disable: true },
    // The docs pages render inside the preview, which manager.ts does not reach —
    // they need the theme handed to them separately or they stay default-Storybook.
    docs: { theme: moflexTheme },
    options: {
      // `Principes` sits at the root rather than inside a section: what the system
      // believes is not one item among its reference material, it is what the rest is an
      // expression of. `Général` follows with the inventories, the barème and the review —
      // « qu'est-ce qui reste dû ». Then the values, then the pieces that only annotate a
      // host, then the components, then how components compose.
      //
      // There is no `Base`: ten pages sharing only « ni champ, ni donnée, ni navigation »
      // is a residue, not a group, so they sit at the root of `Composants`. And no
      // `Legacy` section — ADR-0034 files a page by what it documents, so the six legacy
      // families sit beside their counterpart and carry their own debt table.
      storySort: {
        order: [
          'Principes',
          'Général',
          ['Inventaire', 'Style legacy', 'Barème', 'Accessibilité', 'Revue UI · UX'],
          'Fondations',
          [
            'Couleurs',
            'Typographie',
            'Iconographie',
            'Espacement',
            'Bordures & rayons',
            'Élévation & ombres',
          ],
          'Tokens',
          'Composants',
          [
            'Bouton',
            'Bannière',
            'Carte',
            'Section repliable',
            'Contrôle segmenté',
            'Pastille de provenance',
            'Rail & HUD',
            'Modale',
            'Champs',
            'Données',
            'Navigation',
          ],
          'Patterns',
        ],
      },
    },
  },
}

export default preview
