import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaletteGenerator } from './palette-generator';

// A utility: a tool for the people who use the library, not a slice of it. It lives with the fixtures, so it is never exported.
const meta = { title: 'Utilities/Palette generator', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Tool: StoryObj = { render: () => <PaletteGenerator /> };
