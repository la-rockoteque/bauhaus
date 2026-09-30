import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './text';
import { expectNoAxeViolations } from '../../expect-no-axe-violations';

describe('Text', () => {
  it('renders a paragraph for body, a span for caption and h2 for heading', () => {
    render(<><Text>Body</Text><Text variant="caption">Caption</Text><Text variant="heading">Heading</Text></>);
    expect(screen.getByText('Body').tagName).toBe('P');
    expect(screen.getByText('Caption').tagName).toBe('SPAN');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Heading');
  });

  it('lets the caller choose the element without changing the look', () => {
    render(<Text variant="heading" as="h3">Section</Text>);
    const el = screen.getByRole('heading', { level: 3 });
    expect(el.className).toContain('ds-text--heading');
  });

  it('marks the muted tone', () => {
    render(<Text tone="muted">Hint</Text>);
    expect(screen.getByText('Hint').className).toContain('ds-text--muted');
  });

  it('passes native attributes through, such as id and aria-describedby targets', () => {
    render(<Text id="hint">Hint</Text>);
    expect(screen.getByText('Hint').id).toBe('hint');
  });

  it('has no axe violations', async () => {
    const { container } = render(<><Text variant="heading" as="h1">Title</Text><Text>Body</Text><Text variant="caption" tone="muted">Hint</Text></>);
    await expectNoAxeViolations(container);
  });
});
