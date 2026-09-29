import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type MentionOption, mentionOptionDomId } from './mentionSource';
import { visibleMentionOptions } from './mentionUtils';

interface MentionAutocompleteProps {
  query: string;
  pool: readonly MentionOption[];
  selectedIndex: number;
  /** Ties the listbox and its options to the textarea that owns them. */
  listId: string;
  /**
   * True while the page does not yet answer the live term — the term is still debounced, or the
   * request for it is in flight. The list is then empty because the answer did not arrive, not
   * because no colleague matches, and the two must not look the same.
   */
  isSettling?: boolean;
  /**
   * True when the request for the page failed. An empty list then means the search did not
   * answer at all, which must not read as "no colleague matches this name".
   */
  hasFailed?: boolean;
  onSelectIndex: (i: number) => void;
  onPick: (user: MentionOption) => void;
}

export function MentionAutocomplete({
  query,
  pool,
  selectedIndex,
  listId,
  isSettling = false,
  hasFailed = false,
  onSelectIndex,
  onPick,
}: MentionAutocompleteProps) {
  const { t } = useTranslation('common');
  const ranked = useMemo(() => visibleMentionOptions(pool, query), [pool, query]);

  // Whenever the rankings change, ensure the selection is in range.
  useEffect(() => {
    if (selectedIndex >= ranked.length && ranked.length > 0) {
      onSelectIndex(0);
    }
  }, [ranked.length, selectedIndex, onSelectIndex]);

  if (ranked.length === 0) {
    // The server searches, and the client debounces the term by 200 ms. For that time the page
    // still answers the previous term, so a fast typist empties the filtered list before the
    // matches arrive. Show the search in progress, never the "no match" answer: the popover must
    // not flash an empty list between two keystrokes (QA plan case AC3-5).
    const message = isSettling
      ? t('discussion.mentionSearching')
      : hasFailed
        ? t('discussion.mentionSearchFailed')
        : t('discussion.mentionNoMatch');
    return (
      <div
        className="mo-mention-list mo-mention-list--empty"
        role="listbox"
        id={listId}
        aria-busy={isSettling}
      >
        <p className="mo-mention-empty">{message}</p>
      </div>
    );
  }

  // Disambiguate same-name entries with email.
  const nameCounts = ranked.reduce<Record<string, number>>((acc, u) => {
    acc[u.displayName] = (acc[u.displayName] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="mo-mention-list"
      role="listbox"
      id={listId}
      aria-label={t('discussion.mentionListLabel')}
    >
      {ranked.map((u, i) => {
        const showEmail = u.email !== undefined && (nameCounts[u.displayName] ?? 0) > 1;
        return (
          <button
            type="button"
            role="option"
            aria-selected={i === selectedIndex}
            key={u.id}
            id={mentionOptionDomId(listId, i)}
            /* Out of the tab order on purpose: the textarea keeps the focus and drives the list
               with the arrow keys, so Tab reaches « Envoyer » in one stop instead of walking
               through every candidate. */
            tabIndex={-1}
            className={`mo-mention-option${i === selectedIndex ? ' mo-mention-option--active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(u);
            }}
            onMouseEnter={() => onSelectIndex(i)}
          >
            <span className="mo-mention-option-name">{u.displayName}</span>
            {showEmail && <span className="mo-mention-option-email">{u.email}</span>}
          </button>
        );
      })}
    </div>
  );
}
