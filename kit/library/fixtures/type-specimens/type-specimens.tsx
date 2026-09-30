import { Group } from '../specimens/specimens';
import { LinedPaper, PaperLine, PaperNote } from '../lined-paper/lined-paper';
import { alias, resolve, themeTokens } from '../rulebook/tokens';
import './type-specimens.css';

/**
 * Live specimens for the typography foundation, one section per link of the chain:
 * typefaces (the named families) -> fonts (the six roles) -> text styles (how a job looks at a size).
 * Every name and value is read from the generated tokens, so a swapped family shows up here unedited.
 */
const THEME = 'light';
const PANGRAM = 'The quick brown fox jumps over the lazy dog.';
const FRENCH = 'Voix ambiguë d’un cœur qui, au zéphyr, préfère les jattes de kiwis.';
const CONFUSABLE = 'Il1 O0';
const SCALES = /^--ds-font-(?:size|weight|line-height|letter-spacing)-/;

/** What each role is for, from knowledge/foundations/typefaces.md. */
const JOBS: Readonly<Record<string, string>> = {
  sans: 'UI, body text, headings, forms',
  serif: 'Editorial and long-form reading',
  display: 'Hero and page-title headlines, large sizes only',
  mono: 'Code, IDs and aligned data',
  handwriting: 'Short accents: a note, a signature',
  slab: 'Sturdy kickers and callouts',
};

/** Roles whose figures line up in columns: shown proportional against tabular. Display and handwriting never carry data. */
const FIGURE_ROLES = ['sans', 'serif', 'mono', 'slab'];
/** Roles whose look-alike characters matter: identifiers and codes. */
const CONFUSABLE_ROLES = ['sans', 'mono'];

const STYLE_SAMPLES: Readonly<Record<string, string>> = {
  code: 'ORD-20418  0O 1lI  {"qty": 12}',
  accent: 'Fragile, handle with care',
  kicker: 'New this week',
  display: 'Ships Friday',
};
const DEFAULT_SAMPLE = 'Your order ships on Friday.';

const names = (pattern: RegExp): string[] => Object.keys(themeTokens(THEME)).filter((name) => pattern.test(name));
/** `--ds-typeface-source-serif-4` gives `typeface.source-serif-4`: only the group separator becomes a dot. */
const dotted = (name: string): string => name.replace(/^--ds-/, '').replace('-', '.');
const tail = (name: string, prefix: string): string => name.slice(prefix.length);

/** `--ds-font-sans` and its five siblings; the scales that share the `font` group are left out. */
const roleVars = (): string[] => names(/^--ds-font-/).filter((name) => !SCALES.test(name));
const weightVars = (): string[] => names(/^--ds-font-weight-/);

/** The first family of a stack, without quotes or the ` Variable` Fontsource adds: `"Inter Variable", …` gives Inter. */
const familyName = (stack: string | undefined): string =>
  (stack?.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '').replace(/ Variable$/, '');

/** The typeface variable a role aliases: `var(--ds-typeface-inter)` gives `--ds-typeface-inter`. */
const typefaceOf = (roleVar: string): string | undefined => /var\((--[\w-]+)\)/.exec(alias(THEME, roleVar) ?? '')?.[1];

const styleNames = (): string[] => names(/^--ds-text-[\w-]+-family$/).map((name) => name.slice('--ds-text-'.length, -'-family'.length));

/** The text styles whose family aliases this role. */
const stylesReading = (roleVar: string): string[] => styleNames().filter((style) => alias(THEME, `--ds-text-${style}-family`) === `var(${roleVar})`);

/** One sheet per typeface: the pangram, the French line, the weight ramp, then look-alikes and figures where the role needs them. */
function FaceSheet({ roleVar }: { roleVar: string }) {
  const role = tail(roleVar, '--ds-font-');
  const face = typefaceOf(roleVar);
  if (!face) return null;
  const style = { fontFamily: `var(${face})` };
  return (
    <LinedPaper
      head={
        <>
          <code>{dotted(face)}</code>
          <span className="doc-muted">{`${familyName(resolve(THEME, face))} · read by font.${role}`}</span>
        </>
      }
    >
      <PaperLine style={style}>{PANGRAM}</PaperLine>
      <PaperLine style={style}>{FRENCH}</PaperLine>
      <PaperLine style={style}>
        {weightVars().map((weight) => (
          <span key={weight} className="spec-face-weight" style={{ fontWeight: `var(${weight})` }}>{`Aa ${resolve(THEME, weight)}`}</span>
        ))}
      </PaperLine>
      {CONFUSABLE_ROLES.includes(role) && (
        <PaperLine style={style}>
          {`${CONFUSABLE} `}
          <PaperNote>capital I, lowercase l, digit 1; capital O, digit 0</PaperNote>
        </PaperLine>
      )}
      {FIGURE_ROLES.includes(role) ? (
        <>
          <PaperLine style={{ ...style, fontVariantNumeric: 'proportional-nums' }}>{'1 111 · 8 888 '}<PaperNote>proportional</PaperNote></PaperLine>
          <PaperLine style={{ ...style, fontVariantNumeric: 'tabular-nums' }}>{'1 111 · 8 888 '}<PaperNote>tabular</PaperNote></PaperLine>
        </>
      ) : (
        <PaperLine><PaperNote>Figures: not used at this role's sizes.</PaperNote></PaperLine>
      )}
    </LinedPaper>
  );
}

/** Every named family on its own sheet: its stack's first name, a pangram, the weights the styles use, figures and look-alike characters. */
export function TypefaceSpecimens() {
  return (
    <Group name="typeface.* · the fonts you own">
      <div className="spec-faces">
        {roleVars().map((roleVar) => <FaceSheet key={roleVar} roleVar={roleVar} />)}
      </div>
    </Group>
  );
}

/** Each font role writes the pangram on its own line, in the typeface it reads. */
export function FontsOnPaper() {
  return (
    <LinedPaper blank={6}>
      {roleVars().map((roleVar) => (
        <PaperLine key={roleVar} style={{ fontFamily: `var(${roleVar})` }}>
          {`${PANGRAM} `}
          <PaperNote>{`${familyName(resolve(THEME, typefaceOf(roleVar) ?? roleVar))} · font.${tail(roleVar, '--ds-font-')}`}</PaperNote>
        </PaperLine>
      ))}
    </LinedPaper>
  );
}

/** The six role cards: which typeface each role reads, its job, and the text styles that read it. */
export function FontRoles() {
  return (
    <Group name="font.* · the jobs">
      <div className="spec-rows">
        {roleVars().map((roleVar) => {
          const role = tail(roleVar, '--ds-font-');
          const face = typefaceOf(roleVar);
          const readers = stylesReading(roleVar);
          return (
            <div key={roleVar} className="spec-role-row">
              <code>{`font.${role}`}</code>
              <span>{`→ ${face ? `${dotted(face)} (${familyName(resolve(THEME, face))})` : 'a raw stack'}`}</span>
              <span className="doc-muted">{`${JOBS[role] ?? ''}${readers.length ? ` · text.${readers.join(' · ')}` : ' · no text style reads it yet'}`}</span>
            </div>
          );
        })}
      </div>
    </Group>
  );
}

/** Every text style, drawn with its own family, size, weight and line height. */
export function TypeScale() {
  return (
    <Group name="text.* · how a job looks at a size">
      <div className="spec-rows">
        {styleNames().map((style) => {
          const role = /^var\(--ds-font-([\w-]+)\)$/.exec(alias(THEME, `--ds-text-${style}-family`) ?? '')?.[1] ?? 'raw';
          const token = (part: string): string => `--ds-text-${style}-${part}`;
          return (
            <div key={style} className="spec-type">
              <div className="spec-type-spec">
                <code>{`text.${style}`}</code>
                <code className="doc-muted">{`${role} · ${resolve(THEME, token('size'))} · ${resolve(THEME, token('weight'))} · ${resolve(THEME, token('line-height'))}`}</code>
              </div>
              <p
                className="spec-type-sample"
                style={{ fontFamily: `var(${token('family')})`, fontSize: `var(${token('size')})`, fontWeight: `var(${token('weight')})`, lineHeight: `var(${token('line-height')})` }}
              >
                {STYLE_SAMPLES[style] ?? DEFAULT_SAMPLE}
              </p>
            </div>
          );
        })}
      </div>
    </Group>
  );
}
