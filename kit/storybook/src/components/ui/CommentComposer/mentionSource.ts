/**
 * What a comment composer needs to offer `@mentions`, independent of where the names come from.
 *
 * Two pools exist and they are not alike. Requisitions search the whole directory server-side,
 * so the term is debounced and each term is its own cache entry. A tracker task offers only its
 * own job-scoped managers — a short list, fetched once, with no search to run. Holding both
 * behind one hook-shaped prop is what lets a single composer serve both without a `kind` switch.
 */

/** One offerable name. `email` is the directory's disambiguator; a short pool has none. */
export interface MentionOption {
  /** Stable id of the person, as the thread's own API names them. */
  id: string;
  displayName: string;
  email?: string;
}

/**
 * One `@mention` the user placed, in the composer's own terms.
 *
 * `id` is whatever the thread's API calls a person — an Entra oid for a requisition, a user id
 * for a tracker task. The composer never learns which: the panel that mounts it maps this shape
 * onto its own wire request, because that mapping is the one thing the two threads do not share.
 */
export interface DraftMention {
  id: string;
  displayName: string;
  start: number;
  end: number;
}

/** The DOM id of one option, so the composer's `aria-activedescendant` can point at it. */
export const mentionOptionDomId = (listId: string, index: number) => `${listId}-opt-${index}`;

/** What a source answers for the query the composer is currently showing. */
export interface MentionSourceResult {
  /** The page, already ranked by whoever ranked it. The composer only trims. */
  options: readonly MentionOption[];
  /**
   * The answer for *this* query has not arrived yet — either the term is still debouncing or
   * its request is in flight. An empty list then means "not answered", not "no match", and the
   * popover must not flash its empty state.
   */
  isSettling: boolean;
  isError: boolean;
}

/**
 * The composer is given a resolved pool and reports the term it wants answered; it never calls
 * a fetcher itself.
 *
 * The first cut passed the source as a hook-shaped prop, which reads tidier and is wrong: a
 * tracker task's pool needs its `taskId`, binding that per render creates a new function every
 * time, and calling a hook through a changing variable is a Rules of Hooks violation waiting
 * for its first re-render. Lifting the query into the panel costs three lines there and makes
 * the hazard unrepresentable.
 */
export type MentionQueryListener = (query: string | null) => void;
