import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../clickables/button/button';
import { Icon } from '../../../primitives/icon/icon';
import { EmptyState } from './empty-state';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('EmptyState', () => {
  it('renders the title as a heading, the body and the actions from props', () => {
    render(<EmptyState title="No projects yet" actions={<Button>Create a project</Button>}>Projects you create appear here.</EmptyState>);
    expect(screen.getByRole('heading', { name: 'No projects yet' })).toBeTruthy();
    expect(screen.getByText('Projects you create appear here.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Create a project' })).toBeTruthy();
  });

  it('sets the heading level, two by default', () => {
    const { rerender } = render(<EmptyState title="Nothing here" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
    rerender(<EmptyState title="Nothing here" headingLevel={4} />);
    expect(screen.getByRole('heading', { level: 4 })).toBeTruthy();
  });

  it('hides the media from assistive technology', () => {
    const { container } = render(<EmptyState title="No results" media={<Icon glyph="search" size="lg" />} />);
    expect(container.querySelector('.ds-empty-state__media')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('leaves out the media, body and actions when they are not given', () => {
    const { container } = render(<EmptyState title="All caught up" />);
    expect(container.querySelector('.ds-empty-state__media')).toBeNull();
    expect(container.querySelector('.ds-empty-state__body')).toBeNull();
    expect(container.querySelector('.ds-empty-state__actions')).toBeNull();
  });

  it('has no axe violations for the three none cases', async () => {
    const { container } = render(
      <>
        <EmptyState title="No projects yet" media={<Icon glyph="plus" size="lg" />} actions={<Button>Create a project</Button>}>Create one to get started.</EmptyState>
        <EmptyState title="No results for these filters" headingLevel={3} actions={<Button variant="secondary">Clear filters</Button>}>Status: shipped. Date: last 7 days.</EmptyState>
        <EmptyState title="All caught up" headingLevel={3} media={<Icon glyph="success" size="lg" />}>You cleared your inbox.</EmptyState>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
