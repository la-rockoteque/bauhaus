import type { ReactNode } from 'react';
import { Text } from '../../primitives/text/text';
import { Header } from '../doc-page/doc-page';
import { GuideLink, Section } from '../doc-page/sections';
import type { DocPageProps } from '../doc-page/types';
import { CodeBlock } from './code-block';
import type { CodeLanguage } from './code-block';
import { toJsx } from './to-jsx';
import './examples.css';

export type { CodeLanguage } from './code-block';

/** One use case. The code is the focus: the explanation leads into it, the live result confirms it. */
export interface Example {
  title: string;
  /** When a reader picks this use case, in one sentence. */
  when: string;
  /**
   * How it works, one point each: what every prop in the snippet does, why it is set that way, what the user and
   * assistive technology get, and the basis (a WCAG criterion, an APG pattern, the guide). Write `code` in backticks.
   */
  explain?: readonly string[];
  /** The live result. Leave it out when the snippet draws nothing, such as a token build or a config file. */
  render?: ReactNode;
  /** Draw the result in a narrow column (192px) or at phone width (320px), to show wrapping and reflow. The frame is not in the code. */
  frame?: 'narrow' | 'phone';
  /**
   * The source to show, with comments that explain each choice. Defaults to `render` printed back as JSX, which holds
   * no comments: give `code` for every example a reader should learn from.
   */
  code?: string;
  /** The language of `code`. Default `tsx`. */
  lang?: CodeLanguage;
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
  /** What the reader needs before the first snippet, one point each: setup, the mental model, where the values come from. */
  intro?: readonly string[];
  groups: readonly ExampleGroup[];
}

/** Prose with `code` spans: the backticks become <code>. */
export function Prose({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`)/).map((part, i) => (part.length > 2 && part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))}</>;
}

function ExampleCard({ example }: { example: Example }) {
  const code = example.code ?? (example.render === undefined ? '' : toJsx(example.render));
  const hasResult = example.render !== undefined;
  return (
    <article className="doc-example">
      <header className="doc-example-head">
        <Text as="h3" className="doc-example-title">{example.title}</Text>
        <Text as="p" className="doc-example-when"><Prose text={example.when} /></Text>
        {example.explain && example.explain.length > 0 && (
          <ul className="doc-example-explain">
            {example.explain.map((point, i) => (
              <Text as="li" variant="caption" key={i}><Prose text={point} /></Text>
            ))}
          </ul>
        )}
      </header>
      <div className={hasResult ? 'doc-example-body' : 'doc-example-body doc-example-body--code-only'}>
        <CodeBlock code={code} lang={example.lang} label={example.title} />
        {hasResult && (
          <figure className="doc-example-result">
            <figcaption className="doc-example-result-label">Result</figcaption>
            <div className="doc-example-stage">
              {example.frame ? <div className={`doc-example-frame doc-example-frame--${example.frame}`}>{example.render}</div> : example.render}
            </div>
          </figure>
        )}
      </div>
    </article>
  );
}

/** The Examples page of a slice: every use case as commented code, its explanation and the live result. Beside the Showcase and the Advisories. */
export function ExamplesPage({ name, layer, family, imports, intro, groups, guide, guideName }: ExamplesPageProps) {
  return (
    <article className="doc doc-examples">
      <Header name={name} layer={layer} family={family} />
      <div className="doc-example-setup">
        <CodeBlock code={imports} lang="ts" label="Import" />
        {intro && intro.length > 0 && (
          <ul className="doc-example-intro">
            {intro.map((point, i) => (
              <Text as="li" key={i}><Prose text={point} /></Text>
            ))}
          </ul>
        )}
        <Text variant="caption" tone="muted" as="p">
          Snippets that hold state use React&apos;s <code>useState</code>. Names such as <code>rows</code> or <code>topics</code> stand for your own data.
        </Text>
      </div>
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
