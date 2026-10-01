import { IconButton } from '../../components/clickables/icon-button/icon-button';
import { Switch } from '../../components/fields/switch/switch';
import { TextField } from '../../components/fields/text-field/text-field';
import { Tooltip } from '../../components/overlays/tooltip/tooltip';
import { Icon } from '../../primitives/icon/icon';
import { Text } from '../../primitives/text/text';
import { Segmented } from '../segmented/segmented';
import { VisuallyHidden } from '../../primitives/visually-hidden/visually-hidden';
import { TableScroll } from './table-scroll';
import type { ApiArgs, ApiRow } from './types';

/** The initial values of every row that has a control. */
export const initialArgs = (rows: readonly ApiRow[] = []): ApiArgs => Object.fromEntries(rows.flatMap((row) => (row.control ? [[row.label, row.control.value]] : [])));

function Control({ row, value, onChange }: { row: ApiRow; value: string | boolean; onChange: (value: string | boolean) => void }) {
  const { control } = row;
  // The row header shows the name; the field keeps it as its accessible name only.
  const label = <VisuallyHidden>{row.label}</VisuallyHidden>;
  if (!control) return null;
  if (control.kind === 'boolean') return <Switch label={label} checked={value === true} onChange={(event) => onChange(event.target.checked)} />;
  // A choice of a few: segmented buttons, every option in sight. The group takes the prop name as its accessible name.
  if (control.kind === 'select') return <Segmented label={row.label} value={String(value)} options={control.options.map((option) => ({ value: option, label: option }))} onChange={onChange} />;
  return <TextField label={label} value={String(value)} onChange={(event) => onChange(event.target.value)} />;
}

/**
 * The API: one row per prop, its name, a live control when it has one, and a "!" button whose tooltip holds the description.
 * Changing a control re-renders the stage, so the anatomy, the specs and the tokens view follow.
 */
export function ApiTable({ rows, args, onChange }: { rows?: readonly ApiRow[]; args: ApiArgs; onChange: (args: ApiArgs) => void }) {
  if (!rows?.length) return null;
  return (
    <>
      <Text as="h3" className="doc-h3">
        API
      </Text>
      <TableScroll label="API">
        <table className="doc-table doc-table-rows doc-table-api">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">
                  <span className="doc-api-name">
                    <code>{row.label}</code>
                    <Tooltip content={row.value}>
                      {/* The info glyph turned upside down: an "!" in a circle. */}
                      <IconButton label={`About ${row.label}`} icon={<Icon glyph="info" size="sm" className="doc-api-mark" />} />
                    </Tooltip>
                  </span>
                </th>
                <td>{row.control && <Control row={row} value={args[row.label] ?? row.control.value} onChange={(value) => onChange({ ...args, [row.label]: value })} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </>
  );
}
