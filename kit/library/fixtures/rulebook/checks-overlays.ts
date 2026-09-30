import { all, eachTheme, noLiteral, ratioAtLeast, sourceMatches, uses, type Check } from './checks';
import { rulesOf } from './sources';

/**
 * Auto checks for the overlays slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
const MODAL = 'components/overlays/modal/modal';
const ALERT = 'components/overlays/alert-dialog/alert-dialog';
const CONFIRM = 'components/overlays/confirmation-dialog/confirmation-dialog';
const POPOVER = 'components/overlays/popover/popover';
const TOOLTIP = 'components/overlays/tooltip/tooltip';
const MENU = 'components/overlays/menu/menu';

/** A rule inside a media query whose condition matches `media` declares `property` with `expected`. */
const inMedia = (path: string, media: RegExp, selector: RegExp, property: string, expected: string): Check => () =>
  rulesOf(path).some((rule) => media.test(rule.media ?? '') && selector.test(rule.selector) && (rule.declarations[property] ?? '').includes(expected))
    ? null
    : `${path} has no ${property}: ${expected} for ${selector} inside ${media}`;

const REDUCED = /prefers-reduced-motion:\s*reduce/;

/** Every overlay surface reads the same three roles, the same radius and its shadow rung. */
const surface = (path: string, selector: string, shadow: 1 | 2): Check =>
  all(
    uses(path, selector, 'background', '--ds-overlay-surface'),
    uses(path, selector, 'border', '--ds-overlay-border'),
    uses(path, selector, 'border-radius', '--ds-radius-overlay'),
    uses(path, selector, 'box-shadow', `--ds-shadow-${shadow}`),
  );

const capsToViewport = (path: string, selector: string): Check => uses(path, selector, 'max-inline-size', '100vw');

export const CHECKS: Readonly<Record<string, Check>> = {
  'modal.native-element': all(sourceMatches(`${MODAL}.tsx`, /<dialog[\s>]/, 'modal.tsx does not render a native <dialog>'), sourceMatches(`${MODAL}.tsx`, /\.showModal\(\)/, 'modal.tsx does not open with showModal()')),
  'modal.labelled': sourceMatches(`${MODAL}.tsx`, /aria-labelledby=\{titleId\}/, 'the dialog is not labelled by its title'),
  'modal.focus-in-and-restore': all(
    sourceMatches(`${MODAL}.tsx`, /data-autofocus/, 'modal.tsx does not honour a data-autofocus element'),
    sourceMatches(`${MODAL}.tsx`, /ds-modal__title'\)\?\.focus\(\)/, 'modal.tsx does not fall back to the title'),
    sourceMatches(`${MODAL}.tsx`, /opener\.current\?\.focus\(\)/, 'modal.tsx does not return focus to the opener'),
  ),
  'modal.esc-closes': sourceMatches(`${MODAL}.tsx`, /onCancel=\{\(event\) => \{\s*event\.preventDefault\(\);\s*onClose\(\);/, 'the cancel event does not call onClose'),
  'modal.scrim-configurable': all(
    sourceMatches(`${MODAL}.tsx`, /dismissOnScrim = false/, 'dismissOnScrim does not default to false'),
    sourceMatches(`${MODAL}.tsx`, /dismissOnScrim && event\.target === event\.currentTarget/, 'a scrim click does not depend on dismissOnScrim'),
  ),
  'modal.footer-stays': all(
    uses(`${MODAL}.css`, '.ds-modal__panel', 'display', 'flex'),
    uses(`${MODAL}.css`, '.ds-modal__panel', 'flex-direction', 'column'),
    uses(`${MODAL}.css`, '.ds-modal__panel', 'max-block-size', '100dvh'),
    uses(`${MODAL}.css`, '.ds-modal__body', 'overflow-y', 'auto'),
    uses(`${MODAL}.css`, '.ds-modal__body', 'min-block-size', '0'),
  ),
  'modal.full-screen-narrow': all(
    inMedia(`${MODAL}.css`, /max-width/, /^\.ds-modal:not\(\.ds-modal--inline\)$/, 'inline-size', '100vw'),
    inMedia(`${MODAL}.css`, /max-width/, /^\.ds-modal:not\(\.ds-modal--inline\)$/, 'block-size', '100dvh'),
  ),
  'modal.size-from-tokens': all(...['sm', 'md', 'lg'].map((size) => uses(`${MODAL}.css`, `.ds-modal--${size}`, 'inline-size', `--ds-size-overlay-${size}`))),
  'modal.motion': all(
    uses(`${MODAL}.css`, '.ds-modal', 'transition', '--ds-motion-duration-base'),
    uses(`${MODAL}.css`, '.ds-modal', 'transition', '--ds-motion-ease-exit'),
    uses(`${MODAL}.css`, '.ds-modal[open]', 'transition-timing-function', '--ds-motion-ease-enter'),
    inMedia(`${MODAL}.css`, REDUCED, /^\.ds-modal\[open\]$/, 'transition-property', 'opacity'),
    inMedia(`${MODAL}.css`, REDUCED, /^\.ds-modal\[open\]$/, 'transform', 'none'),
  ),
  'modal.elevation': all(surface(`${MODAL}.css`, '.ds-modal__panel', 2), uses(`${MODAL}.css`, '.ds-modal::backdrop', 'background', '--ds-scrim')),
  'confirmation-dialog.alert-role': all(
    sourceMatches(`${CONFIRM}.tsx`, /role="alertdialog"/, 'confirmation-dialog.tsx does not set role alertdialog'),
    sourceMatches(`${CONFIRM}.tsx`, /aria-describedby=\{descriptionId\}/, 'the message does not describe the confirmation dialog'),
  ),
  'confirmation-dialog.destructive-focus': sourceMatches(`${CONFIRM}.tsx`, /onClick=\{onClose\} data-autofocus=\{destructive \|\| undefined\}/, 'Cancel does not take focus when the action is destructive'),
  'confirmation-dialog.built-on-modal': sourceMatches(`${CONFIRM}.tsx`, /<Modal\b/, 'confirmation-dialog.tsx does not render through Modal'),
  'alert-dialog.alert-role': all(
    sourceMatches(`${ALERT}.tsx`, /role="alertdialog"/, 'alert-dialog.tsx does not set role alertdialog'),
    sourceMatches(`${ALERT}.tsx`, /aria-describedby=\{descriptionId\}/, 'the message does not describe the alert dialog'),
  ),
  'alert-dialog.one-action': sourceMatches(`${ALERT}.tsx`, /footer=\{<Button [^>]*data-autofocus>\{actionLabel\}<\/Button>\}/, 'the footer is not one autofocused action'),
  'modal.state.loading': sourceMatches(`${MODAL}.tsx`, /aria-busy=\{busy \|\| undefined\}/, 'the body does not set aria-busy while busy'),
  'modal.no-literal': noLiteral(`${MODAL}.css`),

  'popover.built-on-aria': all(
    sourceMatches(`${POPOVER}.tsx`, /DialogTrigger/, 'popover.tsx does not use DialogTrigger'),
    sourceMatches(`${POPOVER}.tsx`, /Popover as AriaPopover/, 'popover.tsx does not use the React Aria Popover'),
  ),
  'popover.labelled': sourceMatches(`${POPOVER}.tsx`, /<Dialog aria-label=\{label\}/, 'the popover content is not named by label'),
  'popover.esc-closes': sourceMatches(`${POPOVER}.tsx`, /<DialogTrigger[\s\S]*<AriaPopover[\s\S]*<Dialog /, 'the popover is not a Dialog inside a Popover inside a DialogTrigger'),
  'popover.fits-viewport': all(capsToViewport(`${POPOVER}.css`, '.ds-popover'), uses(`${POPOVER}.css`, '.ds-popover', 'overflow', 'auto')),
  'popover.modality': all(sourceMatches(`${POPOVER}.tsx`, /modal = false/, 'modal does not default to false'), sourceMatches(`${POPOVER}.tsx`, /isNonModal=\{!modal\}/, 'modal does not drive isNonModal')),
  'popover.elevation': surface(`${POPOVER}.css`, '.ds-popover', 1),
  'popover.motion': all(
    uses(`${POPOVER}.css`, '.ds-popover[data-entering]', 'animation', '--ds-motion-duration-base'),
    uses(`${POPOVER}.css`, '.ds-popover[data-exiting]', 'animation', '--ds-motion-ease-exit'),
    inMedia(`${POPOVER}.css`, REDUCED, /^\.ds-popover\[data-entering\]$/, 'animation-name', 'fade'),
  ),
  'popover.no-literal': noLiteral(`${POPOVER}.css`),

  'tooltip.opens-on-focus': all(sourceMatches(`${TOOLTIP}.tsx`, /<TooltipTrigger/, 'tooltip.tsx does not use TooltipTrigger'), sourceMatches(`${TOOLTIP}.tsx`, /<Focusable>/, 'the trigger is not made focusable')),
  'tooltip.dismissible': sourceMatches(`${TOOLTIP}.tsx`, /<TooltipTrigger[\s\S]*<AriaTooltip/, 'the tooltip is not a React Aria Tooltip, which closes on Escape and stays open under the pointer'),
  'tooltip.no-essential-content': sourceMatches(`${TOOLTIP}.tsx`, /content: string;/, 'content is not a string'),
  'tooltip.delay': sourceMatches(`${TOOLTIP}.tsx`, /delay = 500/, 'the tooltip has no default delay'),
  'tooltip.inverse-surface': all(
    uses(`${TOOLTIP}.css`, '.ds-tooltip', 'background', '--ds-surface-inverse'),
    uses(`${TOOLTIP}.css`, '.ds-tooltip', 'color', '--ds-text-inverse'),
    eachTheme(ratioAtLeast('--ds-text-inverse', '--ds-surface-inverse', 4.5)),
  ),
  'tooltip.reflow': all(capsToViewport(`${TOOLTIP}.css`, '.ds-tooltip'), uses(`${TOOLTIP}.css`, '.ds-tooltip', 'overflow-wrap', 'anywhere')),
  'tooltip.no-literal': noLiteral(`${TOOLTIP}.css`),

  'menu.built-on-aria': all(sourceMatches(`${MENU}.tsx`, /MenuTrigger/, 'menu.tsx does not use MenuTrigger'), sourceMatches(`${MENU}.tsx`, /Menu as AriaMenu/, 'menu.tsx does not use the React Aria Menu')),
  'menu.labelled': sourceMatches(`${MENU}.tsx`, /aria-label=\{label\}/, 'the menu is not named by label'),
  'menu.arrow-keys': sourceMatches(`${MENU}.tsx`, /<AriaMenu \{\.\.\.rest\}/, 'the list is not a React Aria Menu, which owns arrows and typeahead'),
  'menu.focus-return': sourceMatches(`${MENU}.tsx`, /<MenuTrigger[\s\S]*<Pressable>\{trigger\}/, 'the trigger is not wired through MenuTrigger'),
  'menu.selection-modes': all(
    sourceMatches(`components/clickables/menu-item/menu-item.tsx`, /selectionMode !== 'none'/, 'menu-item.tsx does not react to the selection mode'),
    sourceMatches(`components/clickables/menu-item/menu-item.tsx`, /isSelected && <Icon glyph="check"/, 'a selected item draws no check'),
  ),
  'menu.fits-viewport': all(capsToViewport(`${MENU}.css`, '.ds-menu__popover'), uses(`${MENU}.css`, '.ds-menu__popover', 'overflow', 'auto')),
  'menu.elevation': surface(`${MENU}.css`, '.ds-menu__popover', 1),
  'menu.motion': all(
    uses(`${MENU}.css`, '.ds-menu__popover[data-entering]', 'animation', '--ds-motion-duration-fast'),
    uses(`${MENU}.css`, '.ds-menu__popover[data-exiting]', 'animation', '--ds-motion-ease-exit'),
    inMedia(`${MENU}.css`, REDUCED, /^\.ds-menu__popover\[data-entering\]$/, 'animation-name', 'fade'),
  ),
  'menu.no-literal': noLiteral(`${MENU}.css`),
};
