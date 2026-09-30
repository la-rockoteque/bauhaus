import { all, eachTheme, noLiteral, pxAtLeast, ratioAtLeast, sourceMatches, uses, type Check } from './checks';

const FIELD = 'components/fields/field';
const at = (name: string) => `components/fields/${name}/${name}`;
const TEXT_FIELD = at('text-field');
const TEXTAREA = at('textarea');
const SELECT = at('select');
const COMBOBOX = at('combobox');
const CHECKBOX = at('checkbox');
const RADIO = at('radio-group');
const SWITCH = at('switch');

const CONTROL = '.ds-field__control';
const ring = (path: string, selector: string): Check =>
  all(uses(path, selector, 'outline', '--ds-focus-ring-color'), uses(path, selector, 'outline-offset', '--ds-focus-ring-offset'));

/** The label is a real label bound with htmlFor, and it shows: no placeholder-as-label (WCAG 3.3.2). */
const labelBound: Check = sourceMatches(`${FIELD}.tsx`, /<label className="ds-field__label" htmlFor=\{ids\.id\}>/, 'field.tsx does not render a label bound with htmlFor');

/** The control gets aria-invalid and aria-describedby from the field ids, and the ids hook builds both from the error and the description. */
const wired = (path: string): Check =>
  all(
    sourceMatches(`${path}.tsx`, /aria-invalid=\{ids\.invalid \|\| undefined\}/, `${path}.tsx does not set aria-invalid from the error`),
    sourceMatches(`${path}.tsx`, /aria-describedby=\{(?:ids\.describedBy|describedBy)\}/, `${path}.tsx does not set aria-describedby`),
    sourceMatches(`${path}.tsx`, /useFieldIds\(/, `${path}.tsx does not build its ids with useFieldIds`),
  );

const errorIsText: Check = all(
  sourceMatches(`${FIELD}.tsx`, /<Icon glyph="error"/, 'the error has no icon'),
  sourceMatches(`${FIELD}.tsx`, /<VisuallyHidden>\{prefix\}: <\/VisuallyHidden>/, 'the error has no text prefix'),
);

const boxContrast: Check = eachTheme((theme) =>
  ratioAtLeast('--ds-field-border', '--ds-surface-default', 3)(theme) ?? ratioAtLeast('--ds-field-border', '--ds-field-surface', 3)(theme),
);

const valueContrast: Check = eachTheme((theme) =>
  ratioAtLeast('--ds-field-text', '--ds-field-surface', 4.5)(theme) ?? ratioAtLeast('--ds-field-placeholder', '--ds-field-surface', 4.5)(theme),
);

const controlTarget: Check = all(uses(`${FIELD}.css`, CONTROL, 'min-block-size', '--ds-size-control-md'), pxAtLeast('--ds-size-control-md', 24));
const choiceTarget: Check = all(uses(`${FIELD}.css`, '.ds-field__choice-target', 'min-block-size', '--ds-size-target-min'), uses(`${FIELD}.css`, '.ds-field__choice', 'grid-template-columns', '--ds-size-target-min'), pxAtLeast('--ds-size-target-min', 24));
const choiceCoversTarget: Check = all(uses(`${FIELD}.css`, '.ds-field__choice-input', 'inline-size', '100%'), uses(`${FIELD}.css`, '.ds-field__choice-input', 'block-size', '100%'));
const selectionContrast: Check = eachTheme((theme) =>
  ratioAtLeast('--ds-selection-surface', '--ds-surface-default', 3)(theme) ?? ratioAtLeast('--ds-selection-mark', '--ds-selection-surface', 3)(theme),
);

const familyLiteral = (own: string): Check => all(noLiteral(`${FIELD}.css`), noLiteral(`${own}.css`));

export const CHECKS: Readonly<Record<string, Check>> = {
  'text-field.native-element': sourceMatches(`${TEXT_FIELD}.tsx`, /<input[\s\n]/, 'text-field.tsx does not render a native <input>'),
  'text-field.visible-label': all(labelBound, sourceMatches(`${TEXT_FIELD}.tsx`, /label: ReactNode;/, 'the label prop is optional')),
  'text-field.error-bound': all(wired(TEXT_FIELD), errorIsText),
  'text-field.focus-ring': ring(`${FIELD}.css`, `${CONTROL}:focus-visible`),
  'text-field.boundary-contrast': boxContrast,
  'text-field.value-contrast': valueContrast,
  'text-field.touch-target': controlTarget,
  'text-field.no-literal': familyLiteral(TEXT_FIELD),
  'text-field.state.disabled': all(sourceMatches(`${FIELD}.css`, /\.ds-field__control:disabled/, 'no disabled rule'), uses(`${FIELD}.css`, `${CONTROL}:disabled`, 'color', '--ds-disabled-text'), uses(`${FIELD}.css`, `${CONTROL}:disabled`, 'background', '--ds-disabled-surface')),
  'text-field.state.read-only': all(uses(`${FIELD}.css`, `${CONTROL}[readonly]`, 'background', '--ds-surface-sunken'), sourceMatches(`${FIELD}.css`, /\.ds-field__control:disabled \{[^}]*--ds-disabled-border/, 'read-only and disabled look the same')),
  'text-field.state.invalid': uses(`${FIELD}.css`, `${CONTROL}[aria-invalid="true"]`, 'border-color', '--ds-field-border-invalid'),

  'textarea.native-element': sourceMatches(`${TEXTAREA}.tsx`, /<textarea[\s\n]/, 'textarea.tsx does not render a native <textarea>'),
  'textarea.visible-label': labelBound,
  'textarea.error-bound': all(wired(TEXTAREA), errorIsText),
  'textarea.counter-bound': sourceMatches(`${TEXTAREA}.tsx`, /counterId[\s\S]*describedBy/, 'the counter is not part of aria-describedby'),
  'textarea.resizable': all(uses(`${TEXTAREA}.css`, '.ds-textarea__input', 'resize', 'vertical'), sourceMatches(`${TEXTAREA}.tsx`, /rows = \d/, 'the textarea sets no rows, so its height is not content-based')),
  'textarea.no-literal': familyLiteral(TEXTAREA),

  'select.native-first': sourceMatches(`${SELECT}.tsx`, /<select[\s\n]/, 'select.tsx does not render a native <select>'),
  'select.visible-label': labelBound,
  'select.error-bound': all(wired(SELECT), errorIsText),
  'select.read-only': all(sourceMatches(`${SELECT}.tsx`, /aria-readonly=\{readOnly \|\| undefined\}/, 'no aria-readonly'), sourceMatches(`${SELECT}.tsx`, /onKeyDown=\{readOnly \? lockKeys/, 'read-only does not block the keys')),
  'select.chevron-decorative': sourceMatches(`${SELECT}.tsx`, /<Icon glyph="chevron-down"/, 'no chevron'),
  'select.no-literal': familyLiteral(SELECT),

  'combobox.focus-stays-in-input': all(
    sourceMatches(`${COMBOBOX}.tsx`, /from 'react-aria-components'/, 'combobox.tsx does not use React Aria Components'),
    sourceMatches(`${COMBOBOX}.tsx`, /<Input className="ds-field__control ds-combobox__input"/, 'the input is not the field control'),
  ),
  'combobox.visible-label': sourceMatches(`${COMBOBOX}.tsx`, /<Label className="ds-field__label">/, 'no React Aria Label'),
  'combobox.error-bound': all(sourceMatches(`${COMBOBOX}.tsx`, /isInvalid=\{Boolean\(error\)\}/, 'isInvalid is not set from the error'), sourceMatches(`${COMBOBOX}.tsx`, /<AriaFieldError className="ds-field__error">/, 'no field error slot'), errorIsText),
  'combobox.state.none': sourceMatches(`${COMBOBOX}.tsx`, /renderEmptyState[\s\S]*emptyText/, 'the list has no empty-state text'),
  'combobox.state.loading': all(sourceMatches(`${COMBOBOX}.tsx`, /aria-busy=\{loading \|\| undefined\}/, 'no aria-busy while loading'), sourceMatches(`${COMBOBOX}.tsx`, /loading \? loadingText/, 'no loading text in the list')),
  'combobox.popup-layer': all(uses(`${COMBOBOX}.css`, '.ds-combobox__popover', 'z-index', '--ds-z-dropdown'), uses(`${COMBOBOX}.css`, '.ds-combobox__popover', 'box-shadow', '--ds-shadow-1')),
  'combobox.option-focus': ring(`${COMBOBOX}.css`, '.ds-combobox__option[data-focus-visible]'),
  'combobox.touch-target': all(uses(`${COMBOBOX}.css`, '.ds-combobox__option', 'min-block-size', '--ds-size-target-min'), uses(`${COMBOBOX}.css`, '.ds-combobox__button', 'inline-size', '--ds-size-target-min')),
  'combobox.reduced-motion': sourceMatches(`${COMBOBOX}.css`, /prefers-reduced-motion: reduce\) \{[\s\S]*animation: none/, 'the popup fade is not switched off'),
  'combobox.no-literal': familyLiteral(COMBOBOX),

  'checkbox.native-element': sourceMatches(`${CHECKBOX}.tsx`, /type="checkbox"/, 'checkbox.tsx does not render <input type="checkbox">'),
  'checkbox.label-clickable': all(sourceMatches(`${CHECKBOX}.tsx`, /<label className="ds-field__choice-label" htmlFor=\{ids\.id\}>/, 'the label is not bound'), choiceCoversTarget),
  'checkbox.mixed-exposed': sourceMatches(`${CHECKBOX}.tsx`, /node\.indeterminate = indeterminate/, 'indeterminate is not set on the native input'),
  'checkbox.box-contrast': all(boxContrast, selectionContrast),
  'checkbox.touch-target': choiceTarget,
  'checkbox.focus-ring': ring(`${CHECKBOX}.css`, '.ds-checkbox__input:focus-visible + .ds-checkbox__box'),
  'checkbox.error-bound': all(wired(CHECKBOX), errorIsText),
  'checkbox.no-literal': familyLiteral(CHECKBOX),

  'radio.fieldset-legend': sourceMatches(`${RADIO}.tsx`, /<fieldset[\s\S]*<legend className="ds-field__label">/, 'the group is not a fieldset with a legend'),
  'radio.arrow-keys': all(sourceMatches(`${RADIO}.tsx`, /type="radio"/, 'not native radios'), sourceMatches(`${RADIO}.tsx`, /name=\{groupName\}/, 'the radios share no name'), sourceMatches(`${RADIO}.tsx`, /role="radiogroup"/, 'no radiogroup role')),
  'radio.error-bound': all(sourceMatches(`${RADIO}.tsx`, /aria-invalid=\{ids\.invalid \|\| undefined\}/, 'no aria-invalid on the group'), sourceMatches(`${RADIO}.tsx`, /aria-describedby=\{ids\.describedBy\}/, 'no aria-describedby on the group'), errorIsText),
  'radio.touch-target': choiceTarget,
  'radio.focus-ring': ring(`${RADIO}.css`, '.ds-radio-group__input:focus-visible + .ds-radio-group__circle'),
  'radio.circle-contrast': all(boxContrast, selectionContrast),
  'radio.no-literal': familyLiteral(RADIO),

  'switch.role': all(sourceMatches(`${SWITCH}.tsx`, /type="checkbox"/, 'not a native checkbox'), sourceMatches(`${SWITCH}.tsx`, /role="switch"/, 'no switch role')),
  'switch.not-colour-alone': all(
    uses(`${SWITCH}.css`, '.ds-switch__input:checked + .ds-switch__track .ds-switch__thumb', 'translate', '--ds-space-4'),
    uses(`${SWITCH}.css`, '.ds-switch__input:checked + .ds-switch__track .ds-switch__check', 'opacity', '1'),
  ),
  'switch.touch-target': choiceTarget,
  'switch.focus-ring': ring(`${SWITCH}.css`, '.ds-switch__input:focus-visible + .ds-switch__track'),
  'switch.track-contrast': selectionContrast,
  'switch.reduced-motion': sourceMatches(`${SWITCH}.css`, /prefers-reduced-motion: reduce\) \{[\s\S]*transition: none/, 'the thumb slide is not switched off'),
  'switch.no-literal': familyLiteral(SWITCH),
};
