import type { ReactNode } from 'react';
import { familyName, roleVars, tail, THEME, typefaceOf } from '../type-specimens/type-specimens';
import { resolve } from '../rulebook/tokens';
import './lined-paper.css';

const PANGRAM = 'The quick brown fox jumps over the lazy dog.';

/** A sheet of school paper. Every child line sits on one blue rule, so children keep the paper's line height. */
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

/** Each font role writes the pangram on its own line, in the typeface it reads. */
export function FontsOnPaper() {
  return (
    <LinedPaper>
      {roleVars().map((roleVar) => {
        const face = typefaceOf(roleVar);
        return (
          <p key={roleVar} style={{ fontFamily: `var(${roleVar})` }}>
            {PANGRAM}
            <span className="paper-face">{` ${familyName(resolve(THEME, face ?? roleVar))} · font.${tail(roleVar, '--ds-font-')}`}</span>
          </p>
        );
      })}
    </LinedPaper>
  );
}
