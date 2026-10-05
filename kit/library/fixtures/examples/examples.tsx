import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Button } from '../../components/clickables/button/button';
import { Text } from '../../primitives/text/text';
import { Header } from '../doc-page/doc-page';
import { GuideLink, Section } from '../doc-page/sections';
import type { DocPageProps } from '../doc-page/types';
import { CodeBlock } from './code-block';
import type { CodeLanguage } from './code-block';
import { toJsx } from './to-jsx';
import '../../primitives/visually-hidden/visually-hidden.css';
import './examples.css';

export type { CodeLanguage } from './code-block';

/** One use case, one slide. The code is the focus: the live result confirms it, the explanation walks through it. */
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

function ExampleSlide({ example, position }: { example: Example; position: string }) {
  const code = example.code ?? (example.render === undefined ? '' : toJsx(example.render));
  const hasResult = example.render !== undefined;
  return (
    <article className="doc-example" aria-roledescription="slide" aria-label={position}>
      <header className="doc-example-head">
        <Text as="h3" className="doc-example-title">{example.title}</Text>
        <Text as="p" className="doc-example-when"><Prose text={example.when} /></Text>
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
      {example.explain && example.explain.length > 0 && (
        <ul className="doc-example-explain">
          {example.explain.map((point, i) => (
            <Text as="li" variant="caption" key={i}><Prose text={point} /></Text>
          ))}
        </ul>
      )}
    </article>
  );
}

/**
 * The use cases as a deck: one slide at a time, Previous and Next, a jump to each group. No rotation, no wrap.
 * The arrow keys move only while the deck's own controls have focus: a live result or a code block keeps its own arrows.
 */
function Deck({ name, groups }: { name: string; groups: readonly ExampleGroup[] }) {
  const slides = groups.flatMap((group) => group.examples.map((example) => ({ group, example })));
  const starts = groups.map((group) => slides.findIndex((slide) => slide.group === group));
  const [chosen, setIndex] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);
  const refocus = useRef<string | null>(null);
  const button = (step: string) => deckRef.current?.querySelector<HTMLButtonElement>(`[data-step="${step}"]`);
  // After the render, once the other button is enabled.
  useEffect(() => {
    const step = refocus.current;
    refocus.current = null;
    if (step) deckRef.current?.querySelector<HTMLButtonElement>(`[data-step="${step}"]`)?.focus();
  }, [chosen]);
  if (slides.length === 0) return null;
  const last = slides.length - 1;
  const index = Math.min(chosen, last);
  const current = slides[index];

  const go = (target: number) => {
    const next = Math.max(0, Math.min(last, target));
    if (next === index) return;
    setIndex(next);
    // A button about to turn disabled would drop focus to the body: hand it to the other one.
    if (next === 0 && document.activeElement === button('previous')) refocus.current = 'next';
    if (next === last && document.activeElement === button('next')) refocus.current = 'previous';
    const deck = deckRef.current;
    // A long slide may have scrolled the deck's top away: bring the new slide's start back.
    if (deck && deck.getBoundingClientRect().top < 0) deck.scrollIntoView?.({ block: 'start' });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last };
    // Alt+Left is Back and Cmd+Left is line start: leave modified keys to the browser.
    if (!(event.key in moves) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    go(moves[event.key]);
  };

  return (
    <div ref={deckRef} className="doc-deck" role="region" aria-roledescription="carousel" aria-label={`${name} examples`}>
      <div className="doc-deck-bar" onKeyDown={onKeyDown}>
        <nav className="doc-deck-groups" aria-label="Example groups">
          {groups.map((group, i) => (
            <button
              type="button"
              key={group.title}
              className="doc-deck-group"
              aria-current={group === current.group ? 'true' : undefined}
              onClick={() => go(starts[i])}
            >
              {group.title} <span className="doc-deck-group-count">{group.examples.length}</span>
            </button>
          ))}
        </nav>
        <div className="doc-deck-controls">
          <Button data-step="previous" variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>Previous</Button>
          <Text as="p" variant="caption" className="doc-deck-count" aria-live="polite" aria-atomic="true">
            {index + 1} / {slides.length}<span className="ds-visually-hidden">: {current.example.title}</span>
          </Text>
          <Button data-step="next" variant="secondary" onClick={() => go(index + 1)} disabled={index === last}>Next</Button>
        </div>
      </div>
      <Section title={current.group.title} kicker={current.group.kicker}>
        <ExampleSlide key={`${current.group.title}/${current.example.title}`} example={current.example} position={`${index + 1} of ${slides.length}`} />
      </Section>
    </div>
  );
}

/** The Examples page of a slice: a deck of use cases, one slide each, with commented code, the live result and the explanation. Beside the Showcase and the Advisories. */
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
      <Deck name={name} groups={groups} />
      <GuideLink guide={guide} guideName={guideName} />
    </article>
  );
}
