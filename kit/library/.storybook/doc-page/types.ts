import type { ReactNode } from 'react';

/** The layer a page documents, as the eyebrow names it. A token group is a kind of page, not a layer. */
export type Layer = 'Foundation' | 'Primitive' | 'Component' | 'Pattern' | 'Theme';

/** One row of the Tokens table. */
export interface TokenRow {
  /** Dotted token name as the source files spell it: `action.primary`, `space.1 … space.12`. */
  name: string;
  /** `1` and `2` are the primitive and semantic tiers, `role` a theme role, `3` a component token. */
  tier: '1' | '2' | '3' | 'role';
  /** What the token is for. For a defined token, its value or alias may come first. */
  use: string;
  /** A CSS custom property (`--ds-action-primary`) drawn as a swatch beside the name. Colour tokens only. */
  swatch?: string;
}

export interface TokensSpec {
  /** `defined` for a foundation or theme, `consumed` for a component or pattern. */
  mode: 'defined' | 'consumed';
  rows: readonly TokenRow[];
  /** A line under the table, such as "The button has no component tokens." */
  note?: string;
}

/** A numbered pin on the anatomy stage. */
export interface AnatomyPart {
  n: number;
  label: string;
  /** Required or optional, or a short clarification. Shown after the label in the legend. */
  note?: string;
  /**
   * CSS left and top of the pin, relative to the rendered component box. Keep pins outside
   * that box: `-18px` and `calc(100% + 18px)` sit just beyond an edge, percentages centre along one.
   */
  x: string;
  y: string;
}

export interface Anatomy {
  render: ReactNode;
  parts: readonly AnatomyPart[];
  /** CSS width of the stage, as a token expression; defaults to hugging the content. */
  stageWidth?: string;
  /** CSS padding around the component so pins near the edge are not clipped, as a token: `var(--ds-space-12)`. */
  stagePadding?: string;
}

export interface Row {
  label: string;
  value: string;
}

/** The nine lifecycle states and the six interaction states of the state matrix. */
export const LIFECYCLE = ['nothing', 'loading', 'none', 'one', 'some', 'too-many', 'incorrect', 'correct', 'done'] as const;
export const INTERACTION = ['default', 'hover', 'focus-visible', 'active', 'disabled', 'selected'] as const;
export type StateId = (typeof LIFECYCLE)[number] | (typeof INTERACTION)[number];

export interface StateCell {
  /** A matrix id, or any free string for a cell the matrix does not name. */
  id: StateId | (string & {});
  /** Shown as the cell title; defaults to the id. */
  label?: string;
  status: 'designed' | 'n/a';
  /** Group for a free id; a matrix id knows its own. */
  group?: 'lifecycle' | 'interaction';
  /** The live render. Required when `designed`. */
  render?: ReactNode;
  /** What produces the state: a prop, or the CSS selector. */
  trigger?: string;
  /** A note under the trigger, such as "forced by .doc-force-hover, which replays the real rule". */
  note?: string;
  /** Why the state cannot occur. Required when `n/a`: an n/a with no reason is `missing`. */
  reason?: string;
}

export interface StatesSpec {
  cells: readonly StateCell[];
  /**
   * The matrix ids this kind of page must answer. Any id not covered by a cell renders as
   * `missing`. Defaults to all fifteen for a component, primitive or pattern, and to none
   * for a foundation or theme.
   */
  expect?: readonly StateId[];
  /** A line above the grid. */
  note?: string;
}

/** One Do or Don't line: one sentence and its basis. */
export interface Guidance {
  text: string;
  /** WCAG number and level, APG pattern, heuristic, or "project decision". */
  basis: string;
  /** For a Don't: the rule id that enforces it. */
  rule?: string;
}

/** A rulebook entry, as `<name>.rules.ts` exports it. */
export interface Rule {
  id: string;
  component: string;
  rubric: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  expectation: string;
  expected?: string;
  verify: 'auto' | 'review';
  /** Accessibility checklist items this rule establishes, by id. */
  covers?: readonly string[];
  basis: string;
}

export interface ExtraSection {
  title: string;
  kicker?: string;
  content: ReactNode;
}

export interface DocPageProps {
  /** The page title: `Button`, `Color`. */
  name: string;
  layer: Layer;
  /** The component family, for a Component: `Clickables`. */
  family?: string;
  /** Plain words first: one to three short sentences and an everyday picture. */
  plain: string;
  /** The precise line: what it is, its one job, what it is not. */
  precise: string;
  /** Where it is used, for the "Used for" line. */
  usedFor?: string;
  tokens: TokensSpec;
  anatomy?: Anatomy;
  /** Live specimens for a foundation, shown at the top of Anatomy. */
  specimens?: ReactNode;
  specs?: readonly Row[];
  /** Public API, name to description. */
  api?: readonly Row[];
  states: StatesSpec;
  /** Extra sections between States and Do and don't. */
  extra?: readonly ExtraSection[];
  dos: readonly Guidance[];
  donts: readonly Guidance[];
  /** The slice's `<name>.rules.ts` export. */
  rules: readonly Rule[];
  /** Storybook id of the guide, such as `clickables-button--docs`. */
  guide: string;
  /** The guide's title in the sidebar, for the pointer line. */
  guideName: string;
}
