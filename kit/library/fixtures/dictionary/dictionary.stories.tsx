import type { Meta, StoryObj } from '@storybook/react-vite';
import tokensCss from '../../dist/tokens.css?raw';
import { TableScroll } from '../doc-page/table-scroll';
import { TokenName } from './dictionary';

// A fixture story shows the block on its own with sample props. The dictionary: every generated token, in prose, with its true name on hover.
const meta = { title: 'Fixtures/Dictionary', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

const NAMES = [...new Set([...tokensCss.matchAll(/--ds-([a-z0-9-]+):/g)].map((m) => m[1]))].sort();

export const Sample: StoryObj = {
  render: () => (
    <div className="doc" style={{ minBlockSize: 'auto' }}>
      <TableScroll label="Dictionary">
        <table className="doc-table">
          <thead>
            <tr><th scope="col">Prose</th><th scope="col">Token</th></tr>
          </thead>
          <tbody>
            {NAMES.map((name) => (
              <tr key={name}>
                <td><TokenName name={name} /></td>
                <td><code>{`--ds-${name}`}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </div>
  ),
};
