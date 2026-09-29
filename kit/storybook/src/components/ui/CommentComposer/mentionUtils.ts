import type { MentionOption } from './mentionSource';

const MAX_RESULTS = 8;

/** The address up to the "@". A row without one keeps its whole value. */
const emailLocalPart = (email: string) => {
  const at = email.indexOf('@');
  return at === -1 ? email : email.slice(0, at);
};

/** Letters that NFD does not decompose, but that the server's CI_AI collation still folds. */
const UNDECOMPOSED_LETTERS: Readonly<Record<string, string>> = {
  ø: 'o',
  ł: 'l',
  đ: 'd',
  œ: 'oe',
  æ: 'ae',
  ß: 'ss',
};

/** Lower case without accents, so "elodie" matches "Élodie" — as the server's CI_AI collation does. */
const foldForSearch = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[øłđœæß]/g, (letter) => UNDECOMPOSED_LETTERS[letter]);

/**
 * Picks the options to show from the page that the server returned.
 *
 * The server ranks the page — display-name prefix, then display-name contains, then e-mail,
 * alphabetically inside each tier. **Keep that order.** The client sees only the page, so a
 * client-side sort can only undo the server ranking.
 *
 * The client still hides an entry that stopped matching what the user typed since the last
 * fetch. The term is debounced, so the page can lag one or two keystrokes behind the caret.
 * This keeps the list narrowing while the user types.
 *
 * The e-mail is matched on its LOCAL PART only, exactly as the server matches it. Every
 * employee address ends in the same domain, so a whole-address test kept every row for a term
 * inside that domain ("mo", "reau", ".ca") and made this filter a no-op for those terms.
 * A pool whose entries carry no e-mail — a tracker task's handful of managers — matches on the
 * display name alone, which is the only thing it was ever going to be asked for.
 *
 * The match ignores case and accents on both sides, exactly as the server does.
 */
export function visibleMentionOptions(
  page: readonly MentionOption[],
  query: string,
): MentionOption[] {
  const q = foldForSearch(query.trim());
  if (!q) return page.slice(0, MAX_RESULTS);

  return page
    .filter(
      (u) =>
        foldForSearch(u.displayName).includes(q) ||
        (u.email !== undefined && foldForSearch(emailLocalPart(u.email)).includes(q)),
    )
    .slice(0, MAX_RESULTS);
}

export function getActiveMentionQuery(body: string, caret: number): { atIndex: number; query: string } | null {
  if (caret === 0) return null;

  // Find the most recent '@' before the caret on the same word (no whitespace between).
  let i = caret - 1;
  while (i >= 0) {
    const ch = body[i];
    if (ch === '@') {
      const before = i === 0 ? ' ' : body[i - 1];
      if (/\s/.test(before)) {
        return { atIndex: i, query: body.substring(i + 1, caret) };
      }
      return null;
    }
    if (/\s/.test(ch)) return null;
    i--;
  }
  return null;
}
