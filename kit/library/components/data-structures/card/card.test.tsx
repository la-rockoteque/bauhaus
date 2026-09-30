import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Card', () => {
  it('is an article with a heading, a body and a footer', () => {
    const { container } = render(<Card title="Kitchen renovation" footer="Updated Monday">Budget on track.</Card>);
    expect(screen.getByRole('article')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Kitchen renovation', level: 3 })).toBeTruthy();
    expect(container.querySelector('.ds-card__body')?.textContent).toBe('Budget on track.');
    expect(container.querySelector('footer')?.textContent).toBe('Updated Monday');
  });

  it('sets the heading level from headingLevel', () => {
    render(<Card title="Plans" headingLevel={2}>Body</Card>);
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
  });

  it('a static card holds no link', () => {
    render(<Card title="Plans">Body</Card>);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('an href makes the whole card one link named by the title, inside the heading', () => {
    render(<Card title="Kitchen renovation" href="/projects/7">Budget on track.</Card>);
    const link = screen.getByRole('link', { name: 'Kitchen renovation' });
    expect(link.getAttribute('href')).toBe('/projects/7');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('heading').contains(link)).toBe(true);
  });

  it('shows meta beside the title', () => {
    render(<Card title="Plans" meta="Draft">Body</Card>);
    expect(screen.getByText('Draft')).toBeTruthy();
  });

  it('loading keeps the header, marks aria-busy and hides the body', () => {
    render(<Card title="Plans" loading>Real body</Card>);
    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Plans' })).toBeTruthy();
    expect(screen.queryByText('Real body')).toBeNull();
    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('none renders the empty slot in the body', () => {
    render(<Card title="Plans" empty={<p>No plans yet.</p>} />);
    expect(screen.getByText('No plans yet.')).toBeTruthy();
  });

  it('error renders an alert in place of the body', () => {
    render(<Card title="Plans" error="Could not load the plans.">Real body</Card>);
    expect(screen.getByRole('alert').textContent).toBe('Could not load the plans.');
    expect(screen.queryByText('Real body')).toBeNull();
  });

  it('has no axe violations static, linked, loading and in error', async () => {
    const { container } = render(
      <>
        <Card title="Static" footer="Footer" meta="Open">Body</Card>
        <Card title="Linked" href="/x">Body</Card>
        <Card title="Loading" loading />
        <Card title="Failed" error="Could not load." />
        <Card title="Empty" empty={<p>None.</p>} />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
