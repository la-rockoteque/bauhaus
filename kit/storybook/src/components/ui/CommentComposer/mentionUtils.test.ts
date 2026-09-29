import { describe, expect, it } from 'vitest';
import type { MentionOption } from './mentionSource';
import { getActiveMentionQuery, visibleMentionOptions } from './mentionUtils';

const user = (displayName: string, email = `${displayName.toLowerCase()}@moreau.ca`): MentionOption => ({
  id: `oid-${displayName}`,
  displayName,
  email,
});

describe('visibleMentionOptions — the server ranks, the client keeps the order (AC3, AC5)', () => {
  it('keeps the order the server returned', () => {
    // The server put the prefix match first, although "Tremblay" follows "Latrembleur".
    const page = [user('Tremblay Zoe'), user('Latrembleur Bernard')];

    const shown = visibleMentionOptions(page, 'trem');

    expect(shown.map((u) => u.displayName)).toEqual(['Tremblay Zoe', 'Latrembleur Bernard']);
  });

  it('does not sort the page alphabetically', () => {
    const page = [user('Zoe'), user('Anna'), user('Bernard')];

    const shown = visibleMentionOptions(page, '');

    expect(shown.map((u) => u.displayName)).toEqual(['Zoe', 'Anna', 'Bernard']);
  });

  it('hides an entry that no longer matches what the user typed', () => {
    // The page was fetched for "tr" and the user has since typed "trem".
    const page = [user('Tremblay Zoe'), user('Tremblay Anna'), user('Tracy Roy')];

    const shown = visibleMentionOptions(page, 'trem');

    expect(shown.map((u) => u.displayName)).toEqual(['Tremblay Zoe', 'Tremblay Anna']);
  });

  it('matches the e-mail as well as the display name', () => {
    const page = [user('Chantal Roy', 'ctremblay@moreau.ca')];

    expect(visibleMentionOptions(page, 'ctrem')).toHaveLength(1);
  });

  it('does not respect case', () => {
    const page = [user('Tremblay Zoe')];

    expect(visibleMentionOptions(page, 'TREM')).toHaveLength(1);
  });

  it('shows at most eight options', () => {
    const page = Array.from({ length: 25 }, (_, i) => user(`Tremblay ${i}`));

    expect(visibleMentionOptions(page, 'trem')).toHaveLength(8);
  });

  it('shows at most eight options with no term', () => {
    const page = Array.from({ length: 25 }, (_, i) => user(`Person ${i}`));

    expect(visibleMentionOptions(page, '')).toHaveLength(8);
  });

  it('returns nothing when the page holds no match', () => {
    expect(visibleMentionOptions([user('Anna')], 'zzz')).toEqual([]);
  });

  it('handles an empty page', () => {
    expect(visibleMentionOptions([], 'trem')).toEqual([]);
  });

  it('does not keep a row on the shared e-mail domain alone', () => {
    // Every employee address ends in the same domain. A whole-address test kept every row for
    // a term drawn from it, so this filter became a no-op exactly when it is needed: while the
    // debounced page still answers the previous term.
    const page = [user('Adam Bergeron'), user('Alice Cote')];

    expect(visibleMentionOptions(page, 'moreau')).toEqual([]);
    expect(visibleMentionOptions(page, '.ca')).toEqual([]);
  });

  it('still matches inside the e-mail local part', () => {
    const chantal = user('Chantal Roy', 'ctremblay@moreau.ca');

    expect(visibleMentionOptions([chantal], 'trem')).toEqual([chantal]);
  });

  // Bug mention-search-ignores-accents — people type names without accents.
  it('matches an accented display name from a term without accents', () => {
    const elodie = user('Élodie Exemple', 'eexemple@moreau.ca');

    expect(visibleMentionOptions([elodie], 'elodie')).toEqual([elodie]);
  });

  it('matches an unaccented display name from a term with accents', () => {
    const eric = user('Eric Gagnon', 'egagnon@moreau.ca');

    expect(visibleMentionOptions([eric], 'éric')).toEqual([eric]);
  });

  it('matches a pool that carries no e-mail, as a tracker task pool does', () => {
    const helene = { id: 'u-1', displayName: 'Hélène Côté' };

    expect(visibleMentionOptions([helene], 'helene')).toEqual([helene]);
  });

  it('folds the letters that have no combining mark, as the server does', () => {
    const lukasz = user('Łukasz Nowak', 'lnowak@moreau.ca');
    const coeur = user('Cœur Strauß', 'cstrauss@moreau.ca');

    expect(visibleMentionOptions([lukasz], 'lukasz')).toEqual([lukasz]);
    expect(visibleMentionOptions([coeur], 'coeur')).toEqual([coeur]);
    expect(visibleMentionOptions([coeur], 'strauss')).toEqual([coeur]);
  });
});

describe('getActiveMentionQuery — unchanged by the paging', () => {
  it('reads the term after the @', () => {
    expect(getActiveMentionQuery('hello @trem', 11)).toEqual({ atIndex: 6, query: 'trem' });
  });

  it('returns null with no trigger', () => {
    expect(getActiveMentionQuery('hello', 5)).toBeNull();
  });

  it('returns null when the @ is inside a word', () => {
    expect(getActiveMentionQuery('mail@moreau', 11)).toBeNull();
  });
});
