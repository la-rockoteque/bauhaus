import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { FontRoles, FontsOnPaper, TypeScale, TypefaceSpecimens } from '../../fixtures/type-specimens/type-specimens';
import { Group } from '../../fixtures/specimens/specimens';
import { typographyRules } from './typography.rules';

const meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Typography"
      layer="Foundation"
      plain="Typography is how words look: which typeface, how big, how heavy, how tall each line is. Typefaces are the fonts you own, fonts are the jobs, and text styles are how a job looks at each size. A heading looks the same wherever it appears."
      precise="Foundation · three links: six named typefaces, six font roles that alias them, and nine text styles built from the roles and the size, weight and line-height scales · governs all text in the library."
      usedFor="All text, through the Text primitive and text.label.* for control labels."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'typeface.inter · source-serif-4 · fraunces · jetbrains-mono · caveat · bitter', tier: '1', use: 'Named families, each a full stack that ends in a generic family. Components never read them.' },
          { name: 'font.sans → typeface.inter', tier: '1', use: 'Interface and body text' },
          { name: 'font.serif → typeface.source-serif-4', tier: '1', use: 'Long-form reading' },
          { name: 'font.display → typeface.fraunces', tier: '1', use: 'Hero and page-title headlines' },
          { name: 'font.mono → typeface.jetbrains-mono', tier: '1', use: 'Code, identifiers and aligned data' },
          { name: 'font.handwriting → typeface.caveat', tier: '1', use: 'Short accents only' },
          { name: 'font.slab → typeface.bitter', tier: '1', use: 'Kickers and sturdy callouts' },
          { name: 'font.size.xs · sm · md · lg · xl · 2xl', tier: '1', use: '12, 14, 16, 18, 24, 36 px' },
          { name: 'font.weight.regular · medium · semibold', tier: '1', use: '400, 500, 600' },
          { name: 'font.line-height.tight · normal', tier: '1', use: '1.25, 1.5' },
          { name: 'text.body.* · caption.* · heading.* · label.*', tier: '2', use: 'Family, size, weight and line height of the interface text' },
          { name: 'text.prose.* · display.* · code.* · accent.* · kicker.*', tier: '2', use: 'Long-form, headline, code, accent and kicker text' },
        ],
      }}
      specimens={
        <>
          <Group name="font.* · on paper">
            <FontsOnPaper />
          </Group>
          <TypefaceSpecimens />
          <FontRoles />
          <TypeScale />
        </>
      }
      specs={[
        { label: 'Chain', value: 'typeface.* → font.<role> → text.<style>.family; components read text styles only' },
        { label: 'Roles', value: 'sans, serif, display, mono, handwriting, slab; a project may leave some unused' },
        { label: 'Body', value: '14px, weight 400, line height 1.5' },
        { label: 'Heading', value: '18px, weight 600, line height 1.25' },
        { label: 'Loading', value: "opt in with the package's fonts.css; latin and latin-ext, font-display swap" },
      ]}
      conditions={{
        cells: [
          { label: 'Text raised to 200%', render: <p style={{ margin: 0, fontSize: 'calc(var(--ds-text-body-size) * 2)', lineHeight: 'var(--ds-text-body-line-height)' }}>Ships Friday.</p>, trigger: 'browser text size', note: 'Layouts must not clip (WCAG 1.4.4, 1.4.12).' },
        ],
      }}
      dos={[
        { text: 'Keep body at 14px or more and line height at 1.5.', basis: 'WCAG 1.4.12 (AA)' },
        { text: 'Size text in a unit that follows the user setting.', basis: 'WCAG 1.4.4 (AA)' },
        { text: 'Mark headings with heading elements, not bold or size.', basis: 'WCAG 1.3.1 (A)' },
        { text: 'Swap a family by editing one alias in fonts.tokens.json.', basis: 'Project decision; typefaces.md rule 17' },
      ]}
      donts={[
        { text: 'Add a new font size for one screen.', basis: 'Closed roles', rule: 'typography.roles-closed' },
        { text: 'Set body text at 12px.', basis: 'Project decision, 14px floor', rule: 'typography.body-min-size' },
        { text: 'Use a line height of 1.2 on paragraphs.', basis: 'WCAG 1.4.12 (AA)', rule: 'typography.line-height-min' },
        { text: 'Set body text, labels or errors in the handwriting face.', basis: 'typefaces.md rules 29 and 31', rule: 'typography.handwriting-accent-only' },
        { text: 'Use more than two text families plus mono on one surface.', basis: 'typefaces.md rule 12', rule: 'typography.max-families' },
        { text: 'End a font stack in a named family.', basis: 'CSS Fonts 4, generic fallback', rule: 'typography.fallback-generic' },
        { text: 'Read a typeface or a font role in a component.', basis: 'typefaces.md rule 18', rule: 'typography.typeface-at-call-site' },
        { text: 'Load font files from a third-party CDN.', basis: 'typefaces.md rule 26 (privacy)', rule: 'typography.self-hosted' },
      ]}
      guide="foundations-typography--docs"
      guideName="Typography"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Typography" layer="Foundation" scope={['resize-text', 'text-spacing', 'headings']} rules={typographyRules} guide="foundations-typography--docs" guideName="Typography" />,
};
