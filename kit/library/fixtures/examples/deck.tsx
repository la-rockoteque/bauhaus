import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/clickables/button/button';
import { Text } from '../../primitives/text/text';
import config from '../../bauhaus.config.json';
import { GuideLink } from '../doc-page/sections';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { CodeBlock } from './code-block';
import type { Example, ExampleGroup, ExamplesPageProps } from './examples';
import { Prose } from './prose';
import { toJsx } from './to-jsx';

type Slide =
  | { kind: 'title'; label: string }
  | { kind: 'group'; label: string; group: ExampleGroup; num: number }
  | { kind: 'example'; label: string; group: ExampleGroup; example: Example };

/** The title slide, then each group's divider followed by its use cases. */
function toSlides(name: string, groups: readonly ExampleGroup[]): Slide[] {
  return [
    { kind: 'title', label: name },
    ...groups.flatMap((group, i): Slide[] => [
      { kind: 'group', label: group.title, group, num: i + 1 },
      ...group.examples.map((example): Slide => ({ kind: 'example', label: example.title, group, example })),
    ]),
  ];
}

/** The keys move the deck only from the page itself or the deck's own buttons: a live result and a code block keep theirs. */
const ownsKeys = (target: EventTarget | null) => target === document.body || (target instanceof Element && target.closest('[data-deck-keys]') !== null);

function TitleSlide({ name, layer, family, imports, intro, guide, guideName }: ExamplesPageProps) {
  return (
    <div className="doc-slide doc-slide--title">
      <div className="doc-slide-lead">
        <Text variant="caption" as="p" className="doc-slide-eyebrow">{`${config.name} · ${family ? `${layer} · ${family}` : layer} · Examples`}</Text>
        <Text as="h1" className="doc-slide-name">{name}</Text>
        <CodeBlock code={imports} lang="ts" label="Import" />
        <Text variant="caption" tone="muted" as="p">
          Snippets that hold state use React&apos;s <code>useState</code>. Names such as <code>rows</code> or <code>topics</code> stand for your own data.
        </Text>
        <GuideLink guide={guide} guideName={guideName} />
      </div>
      {intro && intro.length > 0 && (
        <ul className="doc-slide-points">
          {intro.map((point, i) => (
            <Text as="li" key={i}><Prose text={point} /></Text>
          ))}
        </ul>
      )}
    </div>
  );
}

function GroupSlide({ group, num, onPick }: { group: ExampleGroup; num: number; onPick: (example: Example) => void }) {
  return (
    <div className="doc-slide doc-slide--group">
      <Text as="p" className="doc-slide-num" aria-hidden="true">{String(num).padStart(2, '0')}</Text>
      <Text as="h2" className="doc-slide-group">{group.title}</Text>
      {group.kicker && <Text as="p" className="doc-slide-kicker">{group.kicker}</Text>}
      <ol className="doc-slide-agenda" data-deck-keys>
        {group.examples.map((example) => (
          <li key={example.title}>
            <button type="button" className="doc-slide-agenda-item" onClick={() => onPick(example)}>{example.title}</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ExampleSlide({ group, example }: { group: ExampleGroup; example: Example }) {
  const code = example.code ?? (example.render === undefined ? '' : toJsx(example.render));
  const hasResult = example.render !== undefined;
  return (
    <div className={hasResult ? 'doc-slide doc-slide--example' : 'doc-slide doc-slide--example doc-slide--code-only'}>
      <header className="doc-slide-head">
        <Text variant="caption" as="p" className="doc-slide-eyebrow">{group.title}</Text>
        <Text as="h2" className="doc-slide-title">{example.title}</Text>
        <Text as="p" className="doc-slide-when"><Prose text={example.when} /></Text>
      </header>
      <div className="doc-slide-code">
        <CodeBlock code={code} lang={example.lang} label={example.title} />
        {example.explain && example.explain.length > 0 && (
          <ul className="doc-slide-explain">
            {example.explain.map((point, i) => (
              <Text as="li" variant="caption" key={i}><Prose text={point} /></Text>
            ))}
          </ul>
        )}
      </div>
      {hasResult && (
        <figure className="doc-slide-result">
          <figcaption className="doc-slide-result-label">Result</figcaption>
          <div className="doc-slide-result-body">
            {example.frame ? <div className={`doc-example-frame doc-example-frame--${example.frame}`}>{example.render}</div> : example.render}
          </div>
        </figure>
      )}
    </div>
  );
}

/**
 * The deck: one slide fills the window above a bar with the groups, the theme, Previous, Next and a counter. No rotation,
 * no wrap. A slide taller than the window scrolls on its own; the bar never moves.
 */
export function Deck(props: ExamplesPageProps) {
  const { name, groups } = props;
  const slides = toSlides(name, groups);
  const last = slides.length - 1;
  const [chosen, setChosen] = useState(0);
  const index = Math.min(chosen, last);
  const current = slides[index];
  const deckRef = useRef<HTMLDivElement>(null);
  const refocus = useRef<string | null>(null);
  const button = (step: string) => deckRef.current?.querySelector<HTMLButtonElement>(`[data-step="${step}"]`);

  const go = (target: number) => {
    const next = Math.max(0, Math.min(last, target));
    if (next === index) return;
    // A button about to turn disabled would drop focus to the body: hand it to the other one after the render.
    if (next === 0 && document.activeElement === button('previous')) refocus.current = 'next';
    if (next === last && document.activeElement === button('next')) refocus.current = 'previous';
    setChosen(next);
  };

  useEffect(() => {
    const step = refocus.current;
    refocus.current = null;
    if (step) deckRef.current?.querySelector<HTMLButtonElement>(`[data-step="${step}"]`)?.focus();
  }, [chosen]);

  // Bound to the document, so the keys work from the slide itself, where the focus rests after a click.
  const goRef = useRef(go);
  goRef.current = go;
  const keys = useRef({ index, last });
  keys.current = { index, last };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Alt+Left is Back and Cmd+Left is line start: leave modified keys to the browser.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !ownsKeys(event.target)) return;
      const { index: at, last: end } = keys.current;
      const moves: Record<string, number> = { ArrowLeft: at - 1, ArrowRight: at + 1, PageUp: at - 1, PageDown: at + 1, Home: 0, End: end };
      if (!(event.key in moves)) return;
      event.preventDefault();
      goRef.current(moves[event.key]);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const groupStart = (group: ExampleGroup) => slides.findIndex((slide) => slide.kind === 'group' && slide.group === group);
  const slideOf = (example: Example) => slides.findIndex((slide) => slide.kind === 'example' && slide.example === example);
  const currentGroup = current.kind === 'title' ? null : current.group;

  return (
    <div ref={deckRef} className="doc-deck" role="region" aria-roledescription="carousel" aria-label={`${name} examples`}>
      {/* Keyed per slide: the next slide starts at its top. */}
      <section key={index} className="doc-deck-viewport" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
        {current.kind === 'title' && <TitleSlide {...props} />}
        {current.kind === 'group' && <GroupSlide group={current.group} num={current.num} onPick={(example) => go(slideOf(example))} />}
        {current.kind === 'example' && <ExampleSlide group={current.group} example={current.example} />}
      </section>
      <div className="doc-deck-bar">
        <nav className="doc-deck-groups" aria-label="Example groups" data-deck-keys>
          <button type="button" className="doc-deck-group" aria-current={current.kind === 'title' ? 'true' : undefined} onClick={() => go(0)}>
            {name}
          </button>
          {groups.map((group) => (
            <button type="button" key={group.title} className="doc-deck-group" aria-current={group === currentGroup ? 'true' : undefined} onClick={() => go(groupStart(group))}>
              {group.title} <span className="doc-deck-group-count">{group.examples.length}</span>
            </button>
          ))}
        </nav>
        <div className="doc-deck-controls">
          <ThemeSwitch />
          <div className="doc-deck-steps" data-deck-keys>
            <Button data-step="previous" variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>Previous</Button>
            <Text as="p" variant="caption" className="doc-deck-count" aria-live="polite" aria-atomic="true">
              {index + 1} / {slides.length}<span className="ds-visually-hidden">: {current.label}</span>
            </Text>
            <Button data-step="next" variant="secondary" onClick={() => go(index + 1)} disabled={index === last}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
