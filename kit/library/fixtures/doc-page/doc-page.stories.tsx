import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from './doc-page';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The page shell with minimal props.
const meta = { title: 'Fixtures/Doc page', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Sample: StoryObj = {
  render: () => (
    <DocPage
      name="Sample"
      layer="Component"
      family="Fixtures"
      plain="A page shell with sample props: introduction, anatomy, tokens, states, guidance."
      precise="Fixture · the page every slice showcase renders · not exported."
      tokens={{ mode: 'consumed', rows: [{ name: 'text.default', tier: 'role', use: 'Body text', swatch: '--ds-text-default' }] }}
      anatomy={{ render: <span>Sample</span>, parts: [{ n: 1, label: 'Text', target: 'span' }] }}
      states={{ cells: [{ id: 'default', status: 'designed', render: <span>Sample</span> }, { id: 'hover', status: 'n/a', reason: 'A sample is not interactive.' }] }}
      dos={[{ text: 'Name the basis of every rule.', basis: 'Project decision' }]}
      donts={[{ text: 'Write a line that fits any system.', basis: 'Project decision' }]}
      rules={[]}
      guide="fixtures-doc-page--docs"
      guideName="Doc page"
    />
  ),
};
