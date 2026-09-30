import { Text } from '../../primitives/text/text';
import config from '../../bauhaus.config.json';
import './doc-page.css';
import { StageSection, DosAndDonts, GuideLink, Introduction, Section, Tokens } from './sections';
import { ThemeSwitch } from '../theme-switch/theme-switch';
import { DEFAULT_EXPECT, States } from '../states-grid/states-grid';
import type { DocPageProps, Layer } from './types';

export type { DocPageProps } from './types';

const CHROME: Record<Layer, string> = { Foundation: 'Foundation', Primitive: 'Primitive', Component: 'Component', Pattern: 'Pattern', Theme: 'Theme' };

/** Foundations and themes answer the state matrix through their state roles, not its fifteen cells. */
const NO_MATRIX: readonly Layer[] = ['Foundation', 'Theme'];

/** The page header: the eyebrow, the title and the theme switch. The Advisories page shares it. */
export function Header({ name, layer, family }: Pick<DocPageProps, 'name' | 'layer' | 'family'>) {
  const kind = family ? `${CHROME[layer]} · ${family}` : CHROME[layer];
  return (
    <header className="doc-header">
      <div className="doc-header-title">
        <Text variant="caption" as="p" className="doc-eyebrow">{`${config.name} · ${kind}`}</Text>
        <Text variant="heading" as="h1" className="doc-h1">
          {name}
        </Text>
      </div>
      <ThemeSwitch />
    </header>
  );
}

/**
 * The showcase page of a slice: everything visual, in the order of the page contract.
 * Header, 1 Introduction, 2 Stage, 3 Tokens, 4 States, 5 Do and don't. The live Rulebook and the
 * Accessibility coverage live on the slice's Advisories page; the prose lives in its guide (`<name>.mdx`).
 */
export function DocPage(props: DocPageProps) {
  const { name, layer, family, states, extra = [] } = props;
  const defaultExpect = NO_MATRIX.includes(layer) ? [] : DEFAULT_EXPECT;
  return (
    <article className="doc">
      <Header name={name} layer={layer} family={family} />
      <Introduction plain={props.plain} precise={props.precise} usedFor={props.usedFor} />
      <StageSection stage={props.stage} specimens={props.specimens} specs={props.specs} api={props.api} tokens={props.tokens} />
      <Tokens tokens={props.tokens} />
      <States states={states} defaultExpect={defaultExpect} />
      {extra.map((section) => (
        <Section key={section.title} title={section.title} kicker={section.kicker}>
          {section.content}
        </Section>
      ))}
      <DosAndDonts dos={props.dos} donts={props.donts} />
      <GuideLink guide={props.guide} guideName={props.guideName} />
    </article>
  );
}
export { INTERACTION, LIFECYCLE } from './types';
