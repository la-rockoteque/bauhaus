/**
 * The dictionary: how a token word reads in prose. A word that is not here is capitalised as it is,
 * so the list holds only abbreviations, codes and words that read better spelled out.
 */
export const WORDS: Readonly<Record<string, string>> = {
  xs: 'Extra Small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  '2xl': '2× Large',
  min: 'Minimum',
  max: 'Maximum',
  z: 'Layer Order',
  a06: 'Alpha 6%',
  a10: 'Alpha 10%',
  a16: 'Alpha 16%',
  a32: 'Alpha 32%',
  a48: 'Alpha 48%',
  a64: 'Alpha 64%',
  '*': 'All',
  '<s>': 'Status',
  jetbrains: 'JetBrains',
};

const capital = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

/** One dotted or dashed token name in prose: `border.strong` is "Border Strong", `size.target.min` is "Size Target Minimum". */
function phrase(name: string): string {
  return name
    .replace(/^--ds-/, '')
    .split(/[.\-\s]+/)
    .filter(Boolean)
    .map((word) => WORDS[word.toLowerCase()] ?? capital(word))
    .join(' ');
}

/**
 * A token name as the Tokens and Specs tables write it, in prose. A grouped name keeps its pieces:
 * `focus.ring.color · width · offset` is "Focus Ring Color · Width · Offset".
 */
export function prose(name: string): string {
  return name.split(' · ').map(phrase).join(' · ');
}
