import { all, eachTheme, noLiteral, pxAtLeast, ratioAtLeast, sourceMatches, uses, type Check } from './auto-checks';
import { rulesOf } from './sources';

/**
 * Auto checks for the clickables slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
const LINK = 'components/clickables/link/link';
const MENU_ITEM = 'components/clickables/menu-item/menu-item';

export const hoverGuarded = (path: string): Check => () => {
  const rules = rulesOf(path);
  const bare = rules.filter((rule) => !rule.media && /:hover\b/.test(rule.selector));
  const guarded = rules.some((rule) => /hover:\s*hover/.test(rule.media ?? '') && /:hover\b/.test(rule.selector));
  if (bare.length) return `${path} styles ${bare[0].selector} outside a hover: hover query`;
  return guarded ? null : `${path} has no hover rule inside a hover: hover query`;
};

export const CHECKS: Readonly<Record<string, Check>> = {
  'link.native-element': sourceMatches(`${LINK}.tsx`, /\?\? 'a'/, "link.tsx does not default to a native 'a'"),
  'link.not-colour-alone': uses(`${LINK}.css`, '.ds-link', 'text-decoration-line', 'underline'),
  'link.text-contrast': eachTheme(ratioAtLeast('--ds-text-link', '--ds-surface-default', 4.5)),
  'link.focus-ring': all(uses(`${LINK}.css`, '.ds-link:focus-visible', 'outline', '--ds-focus-ring-color'), uses(`${LINK}.css`, '.ds-link:focus-visible', 'outline-offset', '--ds-focus-ring-offset')),
  'link.touch-target': all(uses(`${LINK}.css`, '.ds-link--standalone', 'min-block-size', '--ds-size-target-min'), uses(`${LINK}.css`, '.ds-link--standalone', 'min-inline-size', '--ds-size-target-min'), pxAtLeast('--ds-size-target-min', 24)),
  'link.no-literal': noLiteral(`${LINK}.css`),
  'link.no-router': sourceMatches(`${LINK}.tsx`, /^(?!.*from '(?:react-router|next\/|@tanstack)).*$/s, 'link.tsx imports a router'),
  'link.external-warned': all(
    sourceMatches(`${LINK}.tsx`, /rel: 'noopener noreferrer'/, 'link.tsx does not set rel noopener'),
    sourceMatches(`${LINK}.tsx`, /<Icon glyph="external"/, 'link.tsx does not draw the external icon'),
    sourceMatches(`${LINK}.tsx`, /<VisuallyHidden>\{externalLabel\}/, 'link.tsx does not add the hidden warning'),
  ),
  'link.current-marked': all(
    sourceMatches(`${LINK}.tsx`, /aria-current=/, 'link.tsx does not set aria-current'),
    uses(`${LINK}.css`, '.ds-link[aria-current]', 'text-decoration-thickness', '--ds-size-border-thick'),
    uses(`${LINK}.css`, '.ds-link[aria-current]', 'font-weight', '--ds-text-label-weight'),
  ),
  'link.states.hover-guarded': hoverGuarded(`${LINK}.css`),

  'menu-item.touch-target': all(uses(`${MENU_ITEM}.css`, '.ds-menu-item', 'min-block-size', '--ds-size-target-min'), pxAtLeast('--ds-size-target-min', 24)),
  'menu-item.focus-ring': all(uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-focus-visible]', 'outline', '--ds-focus-ring-color'), uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-focus-visible]', 'outline-offset', '--ds-focus-ring-width')),
  'menu-item.state.tokens': all(
    uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-focused]', 'background', '--ds-state-hover-layer'),
    uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-pressed]', 'background', '--ds-state-pressed-layer'),
    uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-selected]', 'background', '--ds-state-selected'),
    noLiteral(`${MENU_ITEM}.css`),
  ),
  'menu-item.state.disabled': all(uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-disabled]', 'color', '--ds-disabled-text'), uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-disabled]', 'cursor', 'not-allowed')),
  'menu-item.state.selected': all(
    sourceMatches(`${MENU_ITEM}.tsx`, /isSelected && <Icon glyph="check"/, 'menu-item.tsx does not draw a check for a selected item'),
    uses(`${MENU_ITEM}.css`, '.ds-menu-item[data-selected]', 'background', '--ds-state-selected'),
  ),
  'menu-item.destructive-contrast': all(uses(`${MENU_ITEM}.css`, '.ds-menu-item--destructive', 'color', '--ds-status-error'), eachTheme(ratioAtLeast('--ds-status-error', '--ds-overlay-surface', 4.5))),
  'menu-item.icon-hidden': sourceMatches(`${MENU_ITEM}.tsx`, /ds-menu-item__lead" aria-hidden="true"/, 'the leading icon box is not aria-hidden'),
  'menu-item.no-literal': noLiteral(`${MENU_ITEM}.css`),
};
