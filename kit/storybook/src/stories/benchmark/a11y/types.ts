/** WCAG conformance level a checklist item is claimed at. */
export type Level = 'A' | 'AA' | 'AAA' | '—'

/**
 * What the item is about, which decides where it can be checked.
 *
 * `component` — settled on a primitive's own page: its markup, its focus style, its
 * contrast. These are the ones a component page can carry a checklist for.
 * `page` — settled on a rendered route, not on a primitive: one `h1`, a skip link, a
 * `lang` attribute, a page title.
 * `content` — settled by whoever writes the copy.
 * `media` — the product ships no audio or video today, so these are inapplicable and
 * kept only so the list stays honest about what it does not check.
 */
export type Scope = 'component' | 'page' | 'content' | 'media'

export interface ChecklistItem {
  id: string
  /** The section it comes from in the source checklist. */
  section: string
  /** The requirement, in French, affirmative. */
  requirement: string
  /** The WCAG success criterion the source cites, `null` when it cites none. */
  sc: string | null
  level: Level
  scope: Scope
  /**
   * Set when the source's citation is wrong or stale, with what is true instead. The
   * checklist predates WCAG 2.2 in places and it is better to say so than to inherit it.
   */
  caveat?: string
}
