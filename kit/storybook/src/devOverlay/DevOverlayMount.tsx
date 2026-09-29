import { Suspense, lazy } from 'react'
import { useFeature } from '../hooks/useFeatures'
import { shouldMount } from './shouldMount'

/**
 * Where the development overlay is decided and, when it is wanted, loaded.
 *
 * **Off by default, everywhere.** Two doors open it, and neither is opened by merely
 * running the app:
 *
 * - `VITE_DEV_OVERLAY=true` when the dev server is launched — `VITE_DEV_OVERLAY=true
 *   npm run dev`, or set for good in `.env.development.local`. It also decides whether
 *   the build stamps `data-mo-src` at all, so this variable turns on both halves at once.
 * - the `DevOverlay` feature flag, for the environments there is no shell to set a
 *   variable in — Staging, from the « Rôles » tab of /admin, without a deployment
 *   (ADR-0031).
 *
 * `lazy` is what keeps both cheap: the overlay and axe-core compile into a chunk of
 * their own, so a bundle carries them without ever fetching them until one door opens.
 */
const CONDITIONS = {
  isTest: import.meta.env.MODE === 'test',
  askedFor: import.meta.env.VITE_DEV_OVERLAY === 'true',
}

const DevOverlay = lazy(() =>
  import('./DevOverlay').then((module) => ({ default: module.DevOverlay })),
)

function DevOverlayGate() {
  const flagged = useFeature('DevOverlay')

  if (!shouldMount({ ...CONDITIONS, flagged })) return null

  return (
    <Suspense fallback={null}>
      <DevOverlay />
    </Suspense>
  )
}

/**
 * The gate is behind a second component so the test run never reaches its hooks.
 * Probing the feature flag from every file that renders `Layout` would put a query
 * nobody asked for in front of the whole suite.
 */
export function DevOverlayMount() {
  if (CONDITIONS.isTest) return null

  return <DevOverlayGate />
}
