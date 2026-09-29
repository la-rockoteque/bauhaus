import { all, atLeastPx, builtFrom, contrastAA, declares, focusRing, noLiteralColour, omits, type Check } from './checks'

/**
 * What every `verify: 'auto'` rule actually asserts.
 *
 * The registry and this map are kept apart on purpose: a rule declares *that* it is
 * automated, and `benchmark.test.ts` refuses a rule that claims `auto` without an entry
 * here — so « automated » can never become a label a rule wears without earning it.
 */
export const AUTO_CHECKS: Readonly<Record<string, Check>> = {
  'breadcrumb.hover-token': declares('.mo-crumb-link:hover', 'color', 'var(--mo-primary)'),
  'breadcrumb.focus-ring': focusRing('.mo-crumb-link'),
  'breadcrumb.wraps-never-scrolls': declares('.mo-crumbs-list', 'flex-wrap', 'wrap'),
  'breadcrumb.truncates-long-rung': declares('.mo-crumb-link', 'text-overflow', 'ellipsis'),

  'comment-input.grows-not-scrolls': declares('.mo-composer-field', 'field-sizing', 'content'),
  'comment-input.sized-in-lines': declares('.mo-composer-field', 'min-block-size', '4lh'),
  'comment-input.line-height-declared': declares('.mo-composer-field', 'line-height', '1.45'),
  'comment-input.no-scroll-chaining': declares('.mo-composer-field', 'overscroll-behavior', 'contain'),
  'comment-input.mention-list-opens-upward': declares('.mo-mention-list', 'bottom', '100%'),

  // TM-99. The defect was a composer nested inside two scroll containers, so each of these
  // names a declaration whose removal brings it back.
  'threadpanel.single-scroller': all(
    declares('.mo-panel-body', 'overflow-y', 'auto'),
    declares('.mo-panel-head', 'flex-shrink', '0'),
    declares('.mo-panel-foot', 'flex-shrink', '0'),
  ),
  'threadpanel.body-can-shrink': all(
    declares('.mo-panel', 'min-height', '0'),
    declares('.mo-panel-body', 'min-height', '0'),
  ),
  'threadpanel.no-scroll-chaining': declares('.mo-panel-body', 'overscroll-behavior', 'contain'),
  'threadpanel.scrim-token': all(
    declares('.mo-panel-scrim', 'background-color', 'var(--mo-scrim)'),
    declares('.mo-panel', 'box-shadow', 'var(--mo-shadow-2)'),
  ),

  'banner.tone-tokens': noLiteralColour('.mo-banner--error'),
  'banner.contrast': contrastAA('--mo-ink-soft', '--mo-surface-soft'),

  'button.height': declares('.mo-btn', 'height', '38px'),
  'button.radius': declares('.mo-btn', 'border-radius', 'var(--mo-radius-md)'),
  'button.focus-ring': focusRing('.mo-btn'),
  'button.disabled-tokens': noLiteralColour('.mo-btn--primary:disabled'),
  'button.pending-keeps-tone': all(
    declares(".mo-btn--primary[aria-busy='true']:disabled", 'background', 'var(--mo-primary)'),
    declares(".mo-btn--danger[aria-busy='true']:disabled", 'opacity', '1'),
  ),
  'button.danger-contrast': contrastAA('--mo-surface', '--mo-error'),

  'spinner.current-color': declares('.mo-spinner', 'border-color', 'currentColor'),
  'spinner.round': all(
    declares('.mo-spinner', 'width', '16px'),
    declares('.mo-spinner', 'border-radius', '50%'),
    declares('.mo-spinner--lg', 'width', '32px'),
  ),

  'loading-overlay.scrim-token': all(
    declares('.mo-overlay', 'background-color', 'var(--mo-scrim)'),
    declares('.mo-overlay-panel', 'box-shadow', 'var(--mo-shadow-2)'),
  ),
  'loading-overlay.above-everything': declares('.mo-overlay', 'z-index', 'var(--mo-z-overlay)'),
  'loading-overlay.no-flash': declares(
    '.mo-overlay',
    'animation',
    'mo-fade-in var(--mo-duration-fast) var(--mo-ease-enter) 150ms both',
  ),

  'dialog.scrim-token': all(
    declares('.mo-dialog', 'background-color', 'var(--mo-scrim)'),
    declares('.mo-dialog-surface', 'box-shadow', 'var(--mo-shadow-2)'),
  ),
  'dialog.modal-layer': declares('.mo-dialog', 'z-index', 'var(--mo-z-modal)'),
  'dialog.motion-tokens': all(
    declares('.mo-dialog', 'animation', 'mo-fade-in var(--mo-duration-slow) var(--mo-ease-enter)'),
    declares('.mo-dialog-surface', 'animation', 'mo-enter-from-below var(--mo-duration-slow) var(--mo-ease-enter)'),
  ),
  'dialog.no-literal-colour': all(
    ...['.mo-dialog', '.mo-dialog-surface', '.mo-dialog-head', '.mo-dialog-title', '.mo-dialog-close', '.mo-dialog-body', '.mo-dialog-message', '.mo-dialog-foot'].map(
      noLiteralColour,
    ),
  ),
  'dialog.single-scroller': all(
    declares('.mo-dialog-body', 'overflow-y', 'auto'),
    declares('.mo-dialog-body', 'min-height', '0'),
    declares('.mo-dialog-head', 'flex-shrink', '0'),
    declares('.mo-dialog-foot', 'flex-shrink', '0'),
  ),

  'card.no-shadow': omits('.mo-card', 'box-shadow'),
  'card.state-tokens': noLiteralColour('.mo-card--state-error'),

  'chip.no-literal-colour': noLiteralColour('.mo-chip'),
  'chip.truncates-long-value': all(
    declares('.mo-chip', 'overflow', 'hidden'),
    declares('.mo-chip', 'text-overflow', 'ellipsis'),
  ),

  'count-badge.mono': declares('.mo-count', 'font-family', 'var(--mo-font-mono)'),
  'count-badge.tabular-nums': declares('.mo-count', 'font-variant-numeric', 'tabular-nums'),
  'count-badge.contrast': contrastAA('--mo-muted', '--mo-surface-sunk'),

  'tag.radius': declares('.mo-tag', 'border-radius', 'var(--mo-radius-sm)'),
  'tag.muted-tone-contrast': contrastAA('--mo-muted', '--mo-surface-sunk'),

  'spreadsheet-grid.selection-fill-token': declares(
    '.mo-grid-cell--selected',
    'background-color',
    'var(--mo-primary-soft)',
  ),
  'spreadsheet-grid.selected-muted-text': declares(
    '.mo-grid-cell--selected.mo-grid-cell--muted',
    'color',
    'var(--mo-ink-soft)',
  ),
  'spreadsheet-grid.range-perimeter-token': declares(
    '.mo-grid-cell--edge-top.mo-grid-cell--edge-bottom.mo-grid-cell--edge-left.mo-grid-cell--edge-right',
    'box-shadow',
    'inset 0 0 0 1px var(--mo-primary)',
  ),
  'spreadsheet-grid.fill-handle-size': all(
    declares('.mo-grid-fill-handle', 'inline-size', '7px'),
    declares('.mo-grid-fill-handle', 'block-size', '7px'),
  ),
  'spreadsheet-grid.fill-preview-dashed': declares(
    '.mo-grid-cell--fill',
    'outline',
    '1px dashed var(--mo-primary)',
  ),
  'spreadsheet-grid.editor-ring': declares('.mo-grid-editor', 'outline', '2px solid var(--mo-primary)'),
  'spreadsheet-grid.columns-menu-elevation': declares(
    '.mo-grid-columns-menu',
    'box-shadow',
    'var(--mo-shadow-1)',
  ),
  'spreadsheet-grid.numeric-mono': all(
    declares('.mo-grid-cell--numeric', 'font-family', 'var(--mo-font-mono)'),
    declares('.mo-grid-cell--numeric', 'text-align', 'right'),
  ),
  'spreadsheet-grid.expand-at-the-end': declares(
    '.mo-grid-expand',
    'margin-inline-start',
    'auto',
  ),
  'spreadsheet-grid.row-actions-wear-the-row': all(
    declares('.mo-grid-row-actions-layer', 'align-items', 'stretch'),
    builtFrom('.mo-grid-row-actions', 'background-image', 'var(--mo-primary-tint)'),
  ),
  'spreadsheet-grid.more-fade-token': declares(
    '.mo-grid-more::before',
    'background-image',
    'linear-gradient(to top, var(--mo-surface), transparent)',
  ),
  'spreadsheet-grid.no-literal-colour': noLiteralColour('.mo-grid-cell--selected'),

  'data-table.numeric-mono': declares('.mo-table .mo-table-num', 'font-family', 'var(--mo-font-mono)'),
  'data-table.numeric-align': declares('.mo-table .mo-table-num', 'text-align', 'right'),

  'disclosure.focus-ring': focusRing('.mo-disclosure-summary'),
  'disclosure.radius': declares('.mo-disclosure', 'border-radius', 'var(--mo-radius-lg)'),

  'dropzone.disabled-contrast': contrastAA('--mo-mute-soft', '--mo-surface-soft'),
  'dropzone.dashed-border': declares('.mo-dropzone', 'border', '1px dashed var(--mo-line)'),

  'empty-state.radius': declares('.mo-empty', 'border-radius', 'var(--mo-radius-lg)'),
  'empty-state.dashed-border': declares('.mo-empty', 'border', '1px dashed var(--mo-line)'),

  'filter-bar.no-literal-colour': noLiteralColour('.mo-filters'),

  'hud.count-mono': declares('.mo-hud-count', 'font-family', 'var(--mo-font-mono)'),
  'hud.aside-token-mono': declares('.mo-hud-token', 'font-family', 'var(--mo-font-mono)'),

  'icon-button.touch-target': all(
    atLeastPx('.mo-icon-btn', 'width', 44),
    atLeastPx('.mo-icon-btn', 'height', 44),
  ),
  'icon-button.focus-ring': focusRing('.mo-icon-btn'),

  'kicker.no-uppercase': omits('.mo-kicker', 'text-transform'),

  'list-card.focus-ring': focusRing('.mo-listcard'),
  'list-card.selected-two-signals': all(
    declares('.mo-listcard.is-selected', 'border-color', 'var(--mo-primary)'),
    declares('.mo-listcard.is-selected', 'background', 'var(--mo-primary-tint)'),
  ),

  'page-header.subtitle-max-width': declares('.mo-page-subtitle', 'max-width', '68ch'),

  'page-title.weight-semibold': declares('.mo-page-title', 'font-weight', 'var(--mo-weight-semibold)'),
  'page-title.no-literal-colour': noLiteralColour('.mo-page-title'),

  'pager.info-mono': declares('.mo-pager-info', 'font-family', 'var(--mo-font-mono)'),
  'pager.tabular-nums': declares('.mo-pager-info', 'font-variant-numeric', 'tabular-nums'),

  'provenance-badge.neutral-mono': declares('.mo-provenance', 'font-family', 'var(--mo-font-mono)'),
  'provenance-badge.radius-not-pill': declares('.mo-provenance', 'border-radius', 'var(--mo-radius-sm)'),

  'scope-selector.no-literal-colour': noLiteralColour('.mo-scope'),

  'section-head.hint-contrast': contrastAA('--mo-mute-soft', '--mo-surface'),
  'section-head.underline-token': declares('.mo-section-head', 'border-bottom', '1px solid var(--mo-line-soft)'),

  'side-list.scroll-region': declares('.mo-sidelist-items', 'overflow-y', 'auto'),

  'skeleton.radius': declares('.mo-skeleton', 'border-radius', 'var(--mo-radius-sm)'),
  'skeleton.sunk-surface': declares('.mo-skeleton', 'background', 'var(--mo-surface-sunk)'),
  'skeleton.line-keeps-line-box': all(
    declares('.mo-skeleton--line', 'display', 'inline-block'),
    declares('.mo-skeleton--line', 'vertical-align', 'middle'),
  ),
  'skeleton.lines-block': all(
    declares('.mo-skeleton-lines', 'display', 'block'),
    declares('.mo-skeleton-lines', 'width', '100%'),
  ),

  'summary-rail.no-uppercase-label': all(
    omits('.mo-rail-title', 'text-transform'),
    omits('.mo-rail-label', 'text-transform'),
  ),
  'summary-rail.empty-value-contrast': contrastAA('--mo-mute-soft', '--mo-surface'),
  'summary-rail.value-mono': declares('.mo-rail-value', 'font-family', 'var(--mo-font-mono)'),

  'tabs.focus-ring': focusRing('.mo-tab'),
  'tabs.active-underline-token': declares('.mo-tab.is-active', 'border-bottom-color', 'var(--mo-primary)'),

  'track.pill-radius': declares('.mo-track', 'border-radius', 'var(--mo-radius-pill)'),

  'wizard.step-focus-ring': focusRing('.mo-step-head'),
  'wizard.step-radius': declares('.mo-step', 'border-radius', 'var(--mo-radius-lg)'),
}
