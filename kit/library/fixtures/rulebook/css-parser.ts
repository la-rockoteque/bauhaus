/**
 * A small CSS reader for the live rulebook.
 *
 * Flat passes, no AST. It holds because the library's stylesheets are hand-written: plain rules,
 * `@media` blocks and `@keyframes`, no nesting, no strings holding braces.
 */
export interface CssRule {
  /** One selector of a comma list, whitespace collapsed. */
  selector: string;
  /** The `@media` condition around the rule, when there is one. */
  media?: string;
  declarations: Readonly<Record<string, string>>;
}

const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

function declarationsOf(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of body.split(';')) {
    const at = part.indexOf(':');
    if (at > 0) out[part.slice(0, at).trim()] = part.slice(at + 1).trim();
  }
  return out;
}

/** The body between the brace at `open` and its match, and the index after it. */
function block(css: string, open: number): { body: string; end: number } {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return { body: css.slice(open + 1, i), end: i + 1 };
  }
  return { body: css.slice(open + 1), end: css.length };
}

export function parseCss(source: string, media?: string): CssRule[] {
  const css = strip(source);
  const rules: CssRule[] = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    const { body, end } = block(css, open);
    i = end;
    if (head.startsWith('@media')) rules.push(...parseCss(body, head.slice(6).trim()));
    else if (!head.startsWith('@')) {
      const declarations = declarationsOf(body);
      for (const selector of head.split(',')) rules.push({ selector: selector.trim().replace(/\s+/g, ' '), media, declarations });
    }
  }
  return rules;
}

/** The declarations of `selector` outside any media query, merged in source order. */
export function declarationsFor(rules: readonly CssRule[], selector: string): Record<string, string> | undefined {
  const found = rules.filter((rule) => rule.selector === selector && !rule.media);
  return found.length ? Object.assign({}, ...found.map((rule) => rule.declarations)) : undefined;
}
