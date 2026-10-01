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

/**
 * Where the anchor sits on the target's box.
 * `start` is the default: the middle of the leading edge, just outside the box, so the anchor never covers the glyphs of a text part.
 * `end` is the middle of the trailing edge, also outside. A corner sits diagonally outside that corner.
 * `center` puts the anchor on top of the box: only for a large box such as an input or a card, never for text.
 */
export type AnatomyAt = 'start' | 'end' | 'center' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

/** A numbered part of the anatomy: an anchor on the stage and a row in the parts panel. */
export interface AnatomyPart {
  n: number;
  label: string;
  /** Required or optional, or a short clarification. Shown after the label. */
  note?: string;
  /**
   * CSS selector of the part inside the rendered component, such as `.ds-button__label`.
   * The stage measures its box and puts the anchor exactly there.
   */
  target?: string;
  /** Which point of the target's box holds the anchor. Default `start`. Two anchors on one row need different points. */
  at?: AnatomyAt;
  /** Fallback when there is no `target`: CSS left and top of the anchor, relative to the rendered component box. */
  x?: string;
  y?: string;
}

/** The Stage: the component drawn once, with the anatomy layer (numbered parts) and the specs layer (measured redlines) over it. */
export interface StageSpec {
  render: ReactNode;
  parts: readonly AnatomyPart[];
  /** Ignored: the stage spans the page column. Kept so older call sites still type-check. */
  stageWidth?: string;
  /** Ignored: the stage sets its own padding. Kept so older call sites still type-check. */
  stagePadding?: string;
}

export interface Row {
  label: string;
  value: string;
}

/** What the specs layer measures on a target and draws as a redline. */
export type SpecProperty = 'height' | 'width' | 'padding-inline' | 'padding-block' | 'gap' | 'radius';

/**
 * One spec. With a `property`, the Stage measures it live on `target`, draws it and compares it with `token`.
 * Without one, it is a line of text, as before.
 */
export interface Spec {
  label: string;
  /** For a text spec, the whole spec. For a measured one, an optional note. */
  value?: string;
  property?: SpecProperty;
  /** CSS selector inside the rendered component. Default: the component's root element. */
  target?: string;
  /** Dotted token that sets the value, such as `size.target.min`. A measure that differs from it is flagged as drift. */
  token?: string;
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
  /**
   * The variant this cell shows, as its matrix column: `Vertical`, `Compact`, `Destructive`.
   * Omit it for the base component. A variant is a choice, never a state: `vertical` is not a row.
   */
  variant?: string;
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

/**
 * A user condition a foundation answers: a preference or a setting outside the page, such as
 * reduced motion, text at 200% or forced colors. Not an interaction state: those belong to components.
 */
export interface Condition {
  label: string;
  /** The live render. */
  render: ReactNode;
  /** What sets the condition: the media query or the browser setting. */
  trigger: string;
  note?: string;
}

export interface ConditionsSpec {
  cells: readonly Condition[];
  /** Why the foundation has no condition to answer. Required when `cells` is empty. */
  reason?: string;
}

export interface ExtraSection {
  title: string;
  kicker?: string;
  content: ReactNode;
}

interface DocPageBase {
  /** The page title: `Button`, `Color`. */
  name: string;
  /** The component family, for a Component: `Clickables`. */
  family?: string;
  /** Plain words first: one to three short sentences and an everyday picture. */
  plain: string;
  /** The precise line: what it is, its one job, what it is not. */
  precise: string;
  /** Where it is used, for the "Used for" line. */
  usedFor?: string;
  tokens: TokensSpec;
  stage?: StageSpec;
  /** Live specimens for a foundation, shown at the top of the Stage section. */
  specimens?: ReactNode;
  specs?: readonly Spec[];
  /** Public API, name to description. */
  api?: readonly Row[];
  /** Extra sections between section 4 and Do and don't. */
  extra?: readonly ExtraSection[];
  dos: readonly Guidance[];
  donts: readonly Guidance[];
  /** Storybook id of the guide, such as `clickables-button--docs`. */
  guide: string;
  /** The guide's title in the sidebar, for the pointer line. */
  guideName: string;
}

/** A foundation answers user conditions in section 4. Every other layer answers the state matrix there. */
export type DocPageProps =
  | (DocPageBase & { layer: 'Foundation'; conditions: ConditionsSpec })
  | (DocPageBase & { layer: Exclude<Layer, 'Foundation'>; states: StatesSpec });
