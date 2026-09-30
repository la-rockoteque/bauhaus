import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { GlyphGrid, GlyphSheet, IconCatalog, Keylines, SizePairing } from '../../fixtures/icon-catalog/icon-catalog';
import { iconographyRules } from './iconography.rules';

const meta = { title: 'Foundations/Iconography', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const anatomyStage = (
  <div style={{ maxInlineSize: 'calc(var(--ds-space-12) * 7)' }}>
    <GlyphGrid glyph="search" />
  </div>
);

const notInteractive = 'A glyph has no interaction states. It takes its colour from the control that holds it through currentColor, and that control owns hover, focus, disabled and selected.';

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Iconography"
      layer="Foundation"
      plain="Icons are small pictures for actions and things. They work when they look like one family: the same grid, the same line weight, the same corners. The library draws its own 42, built from circles, squares, triangles and straight lines."
      precise="Foundation · the drawing system and the glyph set, 42 glyphs in four groups · one 24 by 24 grid, one stroke token, square caps and mitre joins, currentColor · the Icon primitive draws them."
      usedFor="Inside buttons, fields, menus, banners and beside status text."
      tokens={{
        mode: 'defined',
        note: 'The colour is currentColor, so no colour token is defined here. The glyph data is in glyphs.ts.',
        rows: [
          { name: 'icon.stroke', tier: '2', use: '2px at 24; the one stroke weight of every glyph. It scales with the icon box' },
          { name: 'size.icon.sm · md · lg', tier: '2', use: '16, 20, 24 px; defined in spacing, paired with text styles below' },
        ],
      }}
      specimens={<Keylines />}
      anatomy={{
        render: anatomyStage,
        parts: [
          { n: 1, label: 'Grid', note: '24 by 24 units, one unit per line', target: '.ds-glyph-grid__grid', at: 'top-start' },
          { n: 2, label: 'Live area', note: '20 by 20, two units of padding; nothing is drawn outside', target: '.ds-glyph-grid__live', at: 'top-end' },
          { n: 3, label: 'Keylines', note: 'circle 20, square 18, portrait 16 × 20, landscape 20 × 16', target: '.ds-glyph-grid__keylines circle', at: 'bottom-end' },
          { n: 4, label: 'Stroke', note: 'icon.stroke, 2 units, square caps, mitre joins', target: '.ds-glyph-grid__glyph', at: 'bottom-start' },
          { n: 5, label: 'Centre line', note: 'the path itself; the stroke grows one unit each side', target: '.ds-glyph-grid__centre', at: 'center' },
        ],
      }}
      specs={[
        { label: 'Grid', value: '24 by 24 viewBox, live area 20 by 20 (2 to 22)' },
        { label: 'Stroke', value: 'icon.stroke = 2px at 24; it scales with the box through the viewBox, 1.33px at sm, 1.67px at md, 2px at lg. No vector-effect' },
        { label: 'Caps and joins', value: 'Square caps, mitre joins, one rule for every glyph' },
        { label: 'Corners', value: 'None. A corner is sharp; a circle is a circle' },
        { label: 'Forms', value: 'Circle, square, triangle and straight lines; arcs only from one circle' },
        { label: 'Fill', value: 'None. No filled variant is defined yet' },
        { label: 'Colour', value: 'currentColor' },
      ]}
      states={{
        cells: [{ id: 'interaction', status: 'n/a', label: 'Interaction', reason: notInteractive }],
      }}
      extra={[
        { title: 'Catalogue', kicker: 'Every glyph by group, at sm, md and lg, in light and dark. Search by name or group.', content: <IconCatalog /> },
        { title: 'Sizes and text', kicker: 'An icon beside text takes the size of that text style and centres on its line.', content: <SizePairing /> },
        { title: 'Construction sheet', kicker: 'Every glyph at 8 times over the grid. Pink line: the centre line. Blue: keylines. Read weight, centring and alignment here.', content: <GlyphSheet /> },
      ]}
      dos={[
        { text: 'Draw on the 24 grid, inside the 20 live area, with the one stroke.', basis: 'Project decision; optical consistency' },
        { text: 'Give an icon-only control a name with IconButton label, and a tooltip with the same words.', basis: 'WCAG 4.1.2 (A); 2.5.3 (A)' },
        { text: 'Put a word beside a status icon.', basis: 'WCAG 1.4.1 (A)' },
        { text: 'Keep a 44px target around a 20px icon.', basis: 'House standard; WCAG 2.5.5 (AAA); 2.5.8 (AA)' },
        { text: 'Add a new glyph to glyphs.ts, with the construction checklist.', basis: 'Nielsen 4' },
      ]}
      donts={[
        { text: 'Mix in a third-party icon or a second stroke weight.', basis: 'Nielsen 4; consistency', rule: 'iconography.stroke-token' },
        { text: 'Draw a curve or an oval, or a corner with a radius.', basis: 'Bauhaus primary forms', rule: 'iconography.primary-forms' },
        { text: 'Write a fill or stroke colour in a glyph.', basis: 'WCAG 1.4.11 (AA)', rule: 'iconography.current-color' },
        { text: 'Let an icon alone say "error".', basis: 'WCAG 1.4.1 (A)', rule: 'iconography.no-colour-only' },
        { text: 'Ship a button that shows only an icon and has no name.', basis: 'WCAG 4.1.2 (A)', rule: 'iconography.icon-only-has-name' },
      ]}
      rules={iconographyRules}
      guide="foundations-iconography--docs"
      guideName="Iconography"
    />
  ),
};
