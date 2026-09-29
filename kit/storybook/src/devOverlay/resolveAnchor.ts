import { STAMP_ATTRIBUTE } from './stampSource'

interface Anchor {
  file: string
  line: number
}

/** Splits `src/pages/Home/Home.tsx:42` into its file and its line. */
export function parseRef(ref: string): Anchor | null {
  const cut = ref.lastIndexOf(':')
  if (cut <= 0) return null

  const line = Number(ref.slice(cut + 1))
  if (!Number.isInteger(line) || line <= 0) return null

  return { file: ref.slice(0, cut), line }
}

/**
 * Whether a stamped path satisfies a finding's path. The agent reports a basename as
 * often as a full path, so a stamp matches when it *ends with* what was asked for, on a
 * segment boundary — `Home.tsx` matches `src/pages/Home/Home.tsx` but not `MyHome.tsx`.
 */
function fileMatches(stamped: string, wanted: string): boolean {
  return stamped === wanted || stamped.endsWith(`/${wanted}`)
}

/**
 * The element a `<file:line>` reference points at.
 *
 * An exact stamp wins. Failing that the nearest stamp in the same file does, preferring
 * one *below* the reported line: a finding written against `<Card>` (a component, which
 * carries no stamp) is answered by the first host element inside it, which is the next
 * stamped line down.
 */
interface Candidate {
  element: Element
  isBelow: boolean
  distance: number
}

/** Scores one stamped element against the reference, or rejects it as the wrong file. */
function candidateFor(element: Element, wanted: Anchor): Candidate | null {
  const stamped = parseRef(element.getAttribute(STAMP_ATTRIBUTE) ?? '')

  if (!stamped || !fileMatches(stamped.file, wanted.file)) return null

  return {
    element,
    isBelow: stamped.line > wanted.line,
    distance: Math.abs(stamped.line - wanted.line),
  }
}

/** Below the reported line beats above it; nearer beats further. See `resolveAnchor`. */
function beats(candidate: Candidate, incumbent: Candidate | null): boolean {
  if (!incumbent) return true
  if (candidate.isBelow !== incumbent.isBelow) return candidate.isBelow

  return candidate.distance < incumbent.distance
}

export function resolveAnchor(ref: string, scope: ParentNode = document): Element | null {
  const wanted = parseRef(ref)
  if (!wanted) return null

  let best: Candidate | null = null

  for (const element of scope.querySelectorAll(`[${STAMP_ATTRIBUTE}]`)) {
    const candidate = candidateFor(element, wanted)

    if (!candidate) continue
    if (candidate.distance === 0) return candidate.element
    if (beats(candidate, best)) best = candidate
  }

  return best?.element ?? null
}

/** The element an advisory targets, by selector when it carries one, by stamp otherwise. */
export function resolveAdvisory(
  advisory: { ref?: string; selector?: string },
  scope: ParentNode = document,
): Element | null {
  if (advisory.selector) {
    try {
      const found = scope.querySelector(advisory.selector)
      if (found) return found
    } catch {
      // A malformed selector is the advisory's bug, not the overlay's — fall through
      // to the stamp rather than taking the whole layer down with it.
    }
  }

  return advisory.ref ? resolveAnchor(advisory.ref, scope) : null
}

/** The stamped reference nearest to `element`, for the inspect picker. */
export function nearestRef(element: Element | null): string | null {
  return element?.closest(`[${STAMP_ATTRIBUTE}]`)?.getAttribute(STAMP_ATTRIBUTE) ?? null
}
