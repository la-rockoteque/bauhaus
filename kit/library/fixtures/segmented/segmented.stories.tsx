import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './segmented';

// A fixture story shows the block on its own with sample props. The segmented control used by the theme switch and the Stage.
const meta = { title: 'Fixtures/Segmented', parameters: { layout: 'centered' } } satisfies Meta;

export default meta;

function Sample() {
  const [value, setValue] = useState<'anatomy' | 'specs'>('anatomy');
  return <Segmented label="Layer" options={[{ value: 'anatomy', label: 'Anatomy' }, { value: 'specs', label: 'Specs' }]} value={value} onChange={setValue} />;
}

export const Default: StoryObj = { render: () => <Sample /> };
