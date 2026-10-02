import { useEffect, useState } from 'react';
import { Highlight } from 'prism-react-renderer';
import type { PrismTheme } from 'prism-react-renderer';

/** The languages a snippet can be written in. `tsx` covers JSX and TypeScript. */
export type CodeLanguage = 'tsx' | 'ts' | 'css' | 'json' | 'bash';

const LANGUAGE_LABEL: Record<CodeLanguage, string> = { tsx: 'TSX', ts: 'TypeScript', css: 'CSS', json: 'JSON', bash: 'Shell' };

// Colours come from the stylesheet (classes per token type), so the theme follows light and dark. The Prism theme stays empty.
const NO_THEME: PrismTheme = { plain: {}, styles: [] };

type Copy = 'idle' | 'copied' | 'failed';
const COPY_STATUS: Record<Copy, string> = { idle: '', copied: 'Copied', failed: 'Copy failed' };
const COPY_RESET_MS = 2000;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<Copy>('idle');
  const copy = async () => {
    // Clear first: the same text set twice is not announced again.
    setState('idle');
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }
  };
  // Back to idle, so a second copy is announced again.
  useEffect(() => {
    if (state === 'idle') return undefined;
    const timer = window.setTimeout(() => setState('idle'), COPY_RESET_MS);
    return () => window.clearTimeout(timer);
  }, [state]);
  // The name stays fixed; the result is a status message beside the button, not inside it (WCAG 4.1.3).
  return (
    <div className="doc-code-copy">
      <span role="status" className="doc-code-copy-status">{COPY_STATUS[state]}</span>
      <button type="button" onClick={copy} aria-label={`Copy code: ${label}`}>Copy</button>
    </div>
  );
}

export interface CodeBlockProps {
  code: string;
  lang?: CodeLanguage;
  /** Names the block for assistive technology and the copy button: usually the example title. */
  label: string;
}

/** A highlighted, numbered, copyable code block. The line numbers are hidden from assistive technology and from a copy. */
export function CodeBlock({ code, lang = 'tsx', label }: CodeBlockProps) {
  return (
    <div className="doc-code">
      <div className="doc-code-bar">
        <span className="doc-code-lang">{LANGUAGE_LABEL[lang]}</span>
        <CopyButton text={code} label={label} />
      </div>
      <Highlight code={code} language={lang === 'bash' ? 'plain' : lang} theme={NO_THEME}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre tabIndex={0} role="group" aria-label={`Code: ${label}`} className="doc-code-pre">
            <code>
              {tokens.map((line, i) => (
                <span key={i} {...getLineProps({ line })} className="doc-code-line">
                  <span className="doc-code-num" aria-hidden="true">{i + 1}</span>
                  <span className="doc-code-text">
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
