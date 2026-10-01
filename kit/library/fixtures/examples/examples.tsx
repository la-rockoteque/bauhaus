import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../../primitives/text/text';
import { Header } from '../doc-page/doc-page';
import { GuideLink, Section } from '../doc-page/sections';
import type { DocPageProps } from '../doc-page/types';
import { toJsx } from './to-jsx';
import './examples.css';

/** One use case: what it is for, the component drawn live, and the code that draws it. */
export interface Example {
  title: string;
  /** When a reader picks this use case, in one sentence. */
  when: string;
  render: ReactNode;
  /** Draw the preview in a narrow column (192px) or at phone width (320px), to show wrapping and reflow. The frame is not in the code. */
  frame?: 'narrow' | 'phone';
  /** The source to show. Defaults to `render` printed back as JSX; give it when the example needs state or wiring. */
  code?: string;
}

/** A section of the page: Variants, States, Composition, In a form… */
export interface ExampleGroup {
  title: string;
  kicker?: string;
  examples: readonly Example[];
}

export interface ExamplesPageProps extends Pick<DocPageProps, 'name' | 'layer' | 'family' | 'guide' | 'guideName'> {
  /** The import line every snippet assumes. */
  imports: string;
  groups: readonly ExampleGroup[];
}

type Copy = 'idle' | 'copied' | 'failed';
const COPY_STATUS: Record<Copy, string> = { idle: '', copied: 'Copied', failed: 'Copy failed' };
const COPY_RESET_MS = 2000;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<Copy>('idle');
  const copy = async () => {
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
    <div className="doc-example-copy">
      <span role="status" className="doc-example-copy-status">{COPY_STATUS[state]}</span>
      <button type="button" onClick={copy} aria-label={`Copy code: ${label}`}>Copy</button>
    </div>
  );
}

function ExampleCard({ example }: { example: Example }) {
  const code = example.code ?? toJsx(example.render);
  return (
    <figure className="doc-example">
      <figcaption className="doc-example-head">
        <Text as="h3" className="doc-example-title">{example.title}</Text>
        <Text variant="caption" tone="muted" as="p">{example.when}</Text>
      </figcaption>
      <div className="doc-example-preview">
        {example.frame ? <div className={`doc-example-frame doc-example-frame--${example.frame}`}>{example.render}</div> : example.render}
      </div>
      <div className="doc-example-code">
        <CopyButton text={code} label={example.title} />
        <pre tabIndex={0} role="region" aria-label={`Code: ${example.title}`}>
          <code>{code}</code>
        </pre>
      </div>
    </figure>
  );
}

/** The Examples page of a slice: every use case drawn live, each with the code that draws it. Beside the Showcase and the Advisories. */
export function ExamplesPage({ name, layer, family, imports, groups, guide, guideName }: ExamplesPageProps) {
  return (
    <article className="doc">
      <Header name={name} layer={layer} family={family} />
      <Text variant="caption" as="p" className="doc-example-imports">
        <span className="doc-label">Import</span>
        <code>{imports}</code>
      </Text>
      <Text variant="caption" tone="muted" as="p" className="doc-example-note">
        Snippets that hold state use React's useState. Names such as rows or topics stand for your own data.
      </Text>
      {groups.map((group) => (
        <Section key={group.title} title={group.title} kicker={group.kicker}>
          <div className="doc-example-list">
            {group.examples.map((example) => (
              <ExampleCard key={example.title} example={example} />
            ))}
          </div>
        </Section>
      ))}
      <GuideLink guide={guide} guideName={guideName} />
    </article>
  );
}
