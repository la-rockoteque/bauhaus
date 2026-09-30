import type { CSSProperties, ReactNode } from 'react';
import { familyName, roleVars, tail, THEME, typefaceOf } from '../type-specimens/type-specimens';
import { resolve } from '../rulebook/tokens';
import './lined-paper.css';

const PANGRAM = 'The quick brown fox jumps over the lazy dog.';

/** A sheet of school paper. Each `PaperLine` child fills one rule. */
export function LinedPaper({ children }: { children: ReactNode }) {
  return (
    <div className="paper">
      <span className="paper-hole" aria-hidden="true" />
      <span className="paper-hole" aria-hidden="true" />
      <span className="paper-hole" aria-hidden="true" />
      <div className="paper-lines">{children}</div>
    </div>
  );
}

/** One line of writing, set on its rule. */
export function PaperLine({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <p className="paper-line" style={style}>
      <span>{children}</span>
    </p>
  );
}

/** Each font role writes the pangram on its own line, in the typeface it reads. */
export function FontsOnPaper() {
  return (
    <LinedPaper>
      {roleVars().map((roleVar) => {
        const face = typefaceOf(roleVar);
        return (
          <PaperLine key={roleVar} style={{ fontFamily: `var(${roleVar})` }}>
            {PANGRAM}
            <span className="paper-face">{` ${familyName(resolve(THEME, face ?? roleVar))} · font.${tail(roleVar, '--ds-font-')}`}</span>
          </PaperLine>
        );
      })}
    </LinedPaper>
  );
}
