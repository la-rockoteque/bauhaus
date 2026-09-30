import type { Meta, StoryObj } from '@storybook/react-vite';
import { GUIDE_COMPONENTS } from './guide';

// A fixture story shows the block on its own with sample props. It is not a DocPage. The prose components of a guide page.
const meta = { title: 'Fixtures/Guide', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const { h1: H1, h2: H2, p: P, table: Table } = GUIDE_COMPONENTS;

export const Sample: StoryObj = {
  render: () => (
    <div className="doc-guide-page">
      <H1>Sample guide</H1>
      <H2>Usage</H2>
      <P>The container styles the prose of every guide page with tokens.</P>
      <Table>
        <thead>
          <tr><th>Token</th><th>Use</th></tr>
        </thead>
        <tbody>
          <tr><td>text.default</td><td>Body text</td></tr>
        </tbody>
      </Table>
    </div>
  ),
};
