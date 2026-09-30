import { Button } from '../../components/clickables/button/button';
import type { StatesSpec } from '../doc-page/types';

/** Sample props shared by the three state-matrix fixture stories: a button with two variants, one missing state and some n/a. */
export const SAMPLE: StatesSpec = {
  cells: [
    { id: 'nothing', status: 'n/a', reason: 'A button holds no data.' },
    { id: 'loading', status: 'designed', render: <Button loading>Save</Button>, trigger: 'loading', note: 'The label stays; the width is locked.' },
    { id: 'none', status: 'n/a', reason: 'No collection.' },
    { id: 'one', status: 'n/a', reason: 'No collection.' },
    { id: 'some', status: 'designed', render: <Button>Save</Button>, trigger: 'rest' },
    { id: 'too-many', status: 'designed', render: <Button>Save and send to the approver</Button>, trigger: 'long label', note: 'Wraps to two lines, never truncates.' },
    { id: 'correct', status: 'n/a', reason: 'Confirmation lives on the field.' },
    { id: 'done', status: 'n/a', reason: 'The view announces the result.' },
    { id: 'default', status: 'designed', render: <Button>Save</Button>, trigger: 'rest' },
    { id: 'default', variant: 'Secondary', status: 'designed', render: <Button variant="secondary">Save</Button> },
    { id: 'hover', status: 'designed', render: <Button className="doc-force-hover">Save</Button>, trigger: ':hover' },
    { id: 'hover', variant: 'Secondary', status: 'designed', render: <Button variant="secondary" className="doc-force-hover">Save</Button> },
    { id: 'focus-visible', status: 'designed', render: <Button className="doc-force-focus">Save</Button>, trigger: ':focus-visible' },
    { id: 'active', status: 'designed', render: <Button className="doc-force-active">Save</Button>, trigger: ':active' },
    { id: 'disabled', status: 'designed', render: <Button disabled>Save</Button>, trigger: 'disabled' },
    { id: 'selected', status: 'n/a', reason: 'Not a toggle.' },
  ],
};
