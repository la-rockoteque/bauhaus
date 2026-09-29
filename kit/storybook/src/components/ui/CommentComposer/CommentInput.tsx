import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MentionAutocomplete } from './MentionAutocomplete';
import { getActiveMentionQuery, visibleMentionOptions } from './mentionUtils';
import {
  mentionOptionDomId,
  type DraftMention,
  type MentionQueryListener,
  type MentionSourceResult,
} from './mentionSource';
import './CommentComposer.css';

export type { DraftMention };

interface CommentInputProps {
  onSubmit: (body: string, mentions: readonly DraftMention[]) => void;
  isPending: boolean;
  /**
   * Whether this caller may write to THIS thread. Required, and not decided here, because the
   * answer differs per thread: a requisition's composer follows `comments:create` (BR §2.4),
   * a tracker task's follows `tracker:entries:write`. The component used to resolve
   * `comments:create` itself, which was right while requisitions were its only caller and
   * would have silently gated tracker comments on a permission the tracker does not use.
   */
  canCreate: boolean;
  /** The names to offer, already resolved by whoever owns the endpoint. */
  mentionPool: MentionSourceResult;
  /** The term the composer wants answered, or null when no `@` trigger is live. */
  onMentionQueryChange: MentionQueryListener;
  initialBody?: string;
  initialMentions?: DraftMention[];
}

/**
 * Re-anchors mention ranges by searching the body for each mention's expected literal "@DisplayName".
 * If a mention's literal can't be found (because the user edited inside the range), the mention is dropped.
 */
function reanchorMentions(body: string, mentions: DraftMention[]): DraftMention[] {
  const out: DraftMention[] = [];
  let cursor = 0;
  for (const m of mentions) {
    const literal = `@${m.displayName}`;
    const idx = body.indexOf(literal, cursor);
    if (idx === -1) continue; // dropped
    out.push({ ...m, start: idx, end: idx + literal.length });
    cursor = idx + literal.length;
  }
  return out;
}

export function CommentInput({
  onSubmit,
  isPending,
  canCreate,
  mentionPool,
  onMentionQueryChange,
  initialBody = '',
  initialMentions = [],
}: CommentInputProps) {
  const { t } = useTranslation('common');
  const [body, setBody] = useState(initialBody);
  const [mentions, setMentions] = useState<DraftMention[]>(initialMentions);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [activeAtIndex, setActiveAtIndex] = useState<number | null>(null);
  /**
   * The highlighted colleague, held as their id and NEVER as an index. The page can be replaced
   * under the user while the term stays the same — the debounced request lands and swaps the
   * list — and an index would then point at a different person.
   */
  const [selectedMentionId, setSelectedMentionId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  /**
   * Firefox has no `field-sizing: content`, so the field is grown by hand there. Safe to run
   * everywhere: where `field-sizing` works this measures the height the browser already chose,
   * and `max-block-size` caps both paths the same way.
   *
   * Driven from an effect on `body` rather than from `onChange`, because the body changes by
   * more paths than typing: sending clears it, picking a mention rewrites it, Backspace can
   * delete a whole mention. An inline `height` beats `field-sizing` in every browser, so a
   * grown box that is never re-measured stays grown — and an empty composer holding 45svh of
   * the panel is the symptom this ticket was raised for, rebuilt.
   */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [body]);
  /** The trigger the highlight belongs to, as `atIndex:query`. Null when the popover is closed. */
  const triggerKeyRef = useRef<string | null>(null);
  /** The trigger the user dismissed with Escape. It stays shut until the term moves on. */
  const dismissedKeyRef = useRef<string | null>(null);
  /**
   * The live `onMentionQueryChange`, read through a ref.
   *
   * The keyup/click listener below is registered ONCE and closes over the first render's
   * `evaluateTrigger`. That was harmless while `evaluateTrigger` only called `useState`
   * setters, which keep their identity — it stopped being harmless when a prop joined them.
   * A caller passing an inline arrow would leave the listener calling the first one forever,
   * so moving the caret with the mouse or the arrow keys would stop refreshing the pool while
   * typing still did: the kind of split behaviour nobody reproduces on the first try.
   */
  const onQueryChangeRef = useRef(onMentionQueryChange);
  // Written in an effect, not during render: it runs after every commit, and the listener that
  // reads it only ever fires from a user event, which is always later than that.
  useEffect(() => {
    onQueryChangeRef.current = onMentionQueryChange;
  });

  const { options: pool, isSettling: isPoolSettling, isError: isPoolError } = mentionPool;
  const ranked = useMemo(() => visibleMentionOptions(pool, activeQuery), [pool, activeQuery]);
  // Derive the index from the id on every render. When the page changes, the highlight follows
  // the person; when that person leaves the page, it falls back to the first option.
  const selectedIndex = Math.max(0, ranked.findIndex((u) => u.id === selectedMentionId));
  /** Ties the textarea to its listbox for `aria-controls` / `aria-activedescendant`. */
  const listId = `${useId()}-mentions`;
  const hintId = `${listId}-hint`;
  /**
   * The status region announces the COUNT and nothing else.
   *
   * Every other state — searching, failed, no match — is a sentence the popover already
   * renders, and that paragraph is in the accessibility tree too. Repeating it here would have
   * it read twice and would risk the two disagreeing. What the popover cannot announce is the
   * arrival of options: they are `tabIndex={-1}` and focus never moves to them, so without this
   * a screen-reader user hears nothing at all when four colleagues appear.
   */
  const announcedPoolState =
    popoverOpen && ranked.length > 0 ? t('discussion.mentionCount', { count: ranked.length }) : '';

  const handleSubmit = () => {
    const trimmed = body.trim();
    if (!trimmed || isPending) return;
    // Ensure offsets reflect the trimmed body (we trim only at submit; mentions index off the untrimmed body
    // but the API expects offsets matching the body that's submitted).
    // The server validates `body.substring(start, end) == "@" + DisplayName`, so we must submit the body
    // exactly as the offsets describe. Submit untrimmed body if mentions were placed at trim positions.
    const wouldShift = body.length !== body.trimStart().length;
    const submitBody = wouldShift ? body : trimmed;
    const adjustedMentions = wouldShift
      ? mentions.map((m) => ({ ...m, start: m.start, end: m.end }))
      : reanchorMentions(submitBody, mentions);

    onSubmit(submitBody, adjustedMentions);
    setBody('');
    setMentions([]);
    setPopoverOpen(false);
    // Nothing left to search for. Without this the panel's query stays non-null for its whole
    // life, so react-query keeps the last term mounted and refetches it on every window focus.
    onQueryChangeRef.current(null);
  };

  const updateBody = (next: string) => {
    setBody(next);
    setMentions((prev) => reanchorMentions(next, prev));
  };

  const evaluateTrigger = (next: string, caret: number) => {
    const trigger = getActiveMentionQuery(next, caret);
    if (trigger) {
      // Move the highlight back to the first option only when the trigger itself changes.
      // The keyup listener below re-evaluates the trigger after EVERY key, so an
      // unconditional reset here undoes ArrowDown before Enter reads the selection.
      // A ref, not state: that listener is registered once and closes over the first render.
      const key = `${trigger.atIndex}:${trigger.query}`;
      if (triggerKeyRef.current !== key) {
        triggerKeyRef.current = key;
        setSelectedMentionId(null);
        // The term moved on, so an earlier Escape no longer applies. Without this the popover
        // stays shut for every later visit to a term the user once dismissed — backspacing
        // from "@tremb" to "@trem" would silently close it again.
        dismissedKeyRef.current = null;
      }
      setActiveAtIndex(trigger.atIndex);
      setActiveQuery(trigger.query);
      // Escape dismissed this exact trigger, so keep it shut. The keyup listener runs after
      // every key, and an unconditional re-open here makes Escape look like it does nothing.
      const shown = dismissedKeyRef.current !== key;
      setPopoverOpen(shown);
      // The term is only worth fetching while it is being shown. Reporting it unconditionally
      // kept the directory search running for terms the user had explicitly dismissed.
      onQueryChangeRef.current(shown ? trigger.query : null);
    } else {
      triggerKeyRef.current = null;
      dismissedKeyRef.current = null;
      setPopoverOpen(false);
      setActiveAtIndex(null);
      setActiveQuery('');
      onQueryChangeRef.current(null);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    updateBody(next);
    evaluateTrigger(next, e.target.selectionStart ?? next.length);
  };

  const insertSelectedMention = (i: number) => {
    if (!popoverOpen || activeAtIndex === null) return false;
    const target = ranked[i];
    if (!target) return false;

    const literal = `@${target.displayName}`;
    const before = body.substring(0, activeAtIndex);
    const caret = textareaRef.current?.selectionStart ?? body.length;
    const after = body.substring(caret);
    const next = `${before}${literal}${after}`;

    const newMention: DraftMention = {
      id: target.id,
      displayName: target.displayName,
      start: activeAtIndex,
      end: activeAtIndex + literal.length,
    };

    setBody(next);
    // Drop any pre-existing mention entirely covered by the new range; re-anchor everything else.
    const filtered = mentions.filter((m) => !(m.start >= activeAtIndex && m.end <= caret));
    const reanchored = reanchorMentions(next, [...filtered, newMention].sort((a, b) => a.start - b.start));
    setMentions(reanchored);
    setPopoverOpen(false);
    setActiveQuery('');
    setActiveAtIndex(null);

    // Restore caret position right after the inserted literal.
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      const newCaret = activeAtIndex + literal.length;
      ta.focus();
      ta.setSelectionRange(newCaret, newCaret);
    });

    return true;
  };

  /** Moves the highlight by one option, and wraps at both ends. */
  const movePopoverHighlight = (delta: number) => {
    if (ranked.length === 0) return;
    const next = (selectedIndex + delta + ranked.length) % ranked.length;
    setSelectedMentionId(ranked[next].id);
    // The options are not focusable, so nothing scrolls them into view on its own. Doing it
    // here is what keeps the 240px list usable by keyboard without handing back the tab stops.
    requestAnimationFrame(() => {
      document
        .getElementById(mentionOptionDomId(listId, next))
        ?.scrollIntoView({ block: 'nearest' });
    });
  };

  /** Escape closes the suggestions. The dismissal ends when the term next changes. */
  const dismissPopover = () => {
    dismissedKeyRef.current = triggerKeyRef.current;
    setPopoverOpen(false);
  };

  /**
   * Enter or Tab inside the popover. Returns true when the popover took the key.
   *
   * An empty list does NOT mean that no colleague matches: while the page is on its way the
   * list is empty because the answer did not arrive. Take the key in that state. If the caller
   * gets it, it posts the comment and clears the draft, so an Enter inside the debounce window
   * sent "@gagne" as plain text and notified nobody. Once the search settles with no match, the
   * caller keeps the key and still sends.
   */
  const commitPopoverSelection = (): boolean => {
    if (ranked.length > 0) {
      insertSelectedMention(selectedIndex);
      return true;
    }
    return isPoolSettling;
  };

  /**
   * Handles a key while the suggestion popover is open. Returns true when the popover took the
   * key, so the caller stops. The guard lives here, and not at the call site, to keep
   * handleKeyDown flat.
   */
  const handlePopoverKey = (e: KeyboardEvent<HTMLTextAreaElement>): boolean => {
    if (!popoverOpen) return false;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      movePopoverHighlight(1);
      return true;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      movePopoverHighlight(-1);
      return true;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      // The popover consumed the Escape, so stop it here. DiscussionPanel listens for Escape on
      // the document and closes the whole panel, which would throw the draft comment away when
      // the user only wanted to dismiss the suggestions.
      e.stopPropagation();
      dismissPopover();
      return true;
    }

    const isCommitKey = e.key === 'Enter' || e.key === 'Tab';
    if (!isCommitKey) return false;
    if (!commitPopoverSelection()) return false;

    e.preventDefault();
    return true;
  };

  /**
   * Atomic delete: when the caret sits at the right edge of a mention, Backspace removes the
   * whole mention. Returns true when it removed one. The guards live here for the same reason.
   */
  const deleteMentionAtCaret = (e: KeyboardEvent<HTMLTextAreaElement>): boolean => {
    if (popoverOpen) return false;
    if (e.key !== 'Backspace') return false;

    const ta = e.currentTarget;
    const caret = ta.selectionStart ?? 0;
    const hit = mentions.find((m) => m.end === caret);
    if (!hit) return false;

    e.preventDefault();
    const next = body.substring(0, hit.start) + body.substring(hit.end);
    setBody(next);
    setMentions(reanchorMentions(next, mentions.filter((m) => m !== hit)));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(hit.start, hit.start);
    });
    return true;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (handlePopoverKey(e)) return;
    if (deleteMentionAtCaret(e)) return;

    const sendsTheComment = e.key === 'Enter' && !e.shiftKey;
    if (sendsTheComment) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Recompute trigger when caret moves via clicks / arrows without changing body.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = () => {
      const caret = ta.selectionStart ?? 0;
      evaluateTrigger(ta.value, caret);
    };
    ta.addEventListener('keyup', handler);
    ta.addEventListener('click', handler);
    return () => {
      ta.removeEventListener('keyup', handler);
      ta.removeEventListener('click', handler);
    };
     
    // `[canCreate]`, not `[]`: the guard below returns null until the permission resolves, so
    // on a first commit while `/api/me` is still in flight there is no textarea to attach to.
    // With an empty dependency list the effect never ran again, and the listeners were never
    // attached for the life of the component — typing still fetched a pool, but moving the
    // caret back into an existing `@Trem` silently never reopened the popover.
  }, [canCreate]);

  // Guard after all hooks (Rules of Hooks): no write on this thread → no composer. The read
  // stays open; the API applies the same rule server-side.
  if (!canCreate) return null;

  return (
    <div className="mo-composer">
      {popoverOpen && (
        <MentionAutocomplete
          query={activeQuery}
          pool={pool}
          selectedIndex={selectedIndex}
          listId={listId}
          isSettling={isPoolSettling}
          hasFailed={isPoolError}
          onSelectIndex={(i) => setSelectedMentionId(ranked[i]?.id ?? null)}
          onPick={(u) => {
            const idx = ranked.findIndex((r) => r.id === u.id);
            insertSelectedMention(idx >= 0 ? idx : 0);
          }}
        />
      )}
      {/* The textarea keeps the focus and owns the list, so a screen reader announces the
          highlighted candidate instead of a silently changing `<div>`, and Tab leaves for
          « Envoyer » rather than walking the options (the options are `tabIndex={-1}`).

          NOT `role="combobox"`, deliberately. This is a multi-line composer where `@` is an
          occasional affordance, not a control whose purpose is picking a value: claiming
          combobox would announce one to someone who is only writing prose, and would drop the
          multi-line text semantics the control actually has. `aria-activedescendant` is
          available to `textbox` and carries the highlight on its own. */}
      <textarea
        ref={textareaRef}
        className="mo-composer-field"
        value={body}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Delay close so click on popover items still fires (they use mousedown to preempt blur).
          setTimeout(() => setPopoverOpen(false), 100);
        }}
        placeholder={t('discussion.writeComment')}
        disabled={isPending}
        aria-controls={popoverOpen ? listId : undefined}
        aria-describedby={hintId}
        aria-autocomplete="list"
        aria-activedescendant={
          popoverOpen && ranked.length > 0 ? mentionOptionDomId(listId, selectedIndex) : undefined
        }
      />
      {/* `aria-expanded` is not in `textbox`'s supported set, so the arrival of the list has to
          be said rather than exposed. A polite status region does it without stealing focus,
          and it is WCAG 4.1.3 either way. */}
      <p className="mo-visually-hidden" role="status">
        {announcedPoolState}
      </p>
      <p id={hintId} className="mo-visually-hidden">
        {t('discussion.mentionHint')}
      </p>

      <button
        type="button"
        className="mo-composer-send"
        onClick={handleSubmit}
        disabled={!body.trim() || isPending}
      >
        {t('discussion.send')}
      </button>
    </div>
  );
}
