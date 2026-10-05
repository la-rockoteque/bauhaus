import type { ReactNode } from 'react';
import type { DocPageProps } from '../doc-page/types';
import type { CodeLanguage } from './code-block';
import { Deck } from './deck';
import '../../primitives/visually-hidden/visually-hidden.css';
import './examples.css';

export type { CodeLanguage } from './code-block';
export { Prose } from './prose';

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

/** A section of the deck: Variants, States, Composition, In a form… It opens on a divider slide. */
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

/**
 * The Examples page of a slice: a deck the size of the window. A title slide (the import and the intro), a divider per
 * group, then one slide per use case with its commented code, the live result and the explanation.
 */
export function ExamplesPage(props: ExamplesPageProps) {
  return <Deck {...props} />;
}
