import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './progress';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Progress', () => {
  it('is a native progress element named by its visible label', () => {
    render(<Progress label="Uploading report.pdf" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading report.pdf' });
    expect(bar.tagName).toBe('PROGRESS');
  });

  it('exposes the value and the maximum', () => {
    render(<Progress label="Upload" value={30} max={120} />);
    const bar = screen.getByRole('progressbar') as HTMLProgressElement;
    expect(bar.value).toBe(30);
    expect(bar.max).toBe(120);
  });

  it('shows the percent in text and as the value text', () => {
    render(<Progress label="Upload" value={30} max={120} />);
    expect(screen.getByText('25%')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe('25%');
  });

  it('takes a custom value text', () => {
    render(<Progress label="Import" value={3} max={12} valueText="3 of 12 rows" />);
    expect(screen.getByText('3 of 12 rows')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe('3 of 12 rows');
  });

  it('is indeterminate without a value: no value attribute and no value text', () => {
    render(<Progress label="Preparing export" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.hasAttribute('value')).toBe(false);
    expect(bar.hasAttribute('aria-valuetext')).toBe(false);
    expect(document.querySelector('.ds-progress__value')).toBeNull();
  });

  it('shows an error as text and marks the bar invalid', () => {
    render(<Progress label="Upload" value={60} error="The connection dropped at 60%." />);
    expect(screen.getByText('The connection dropped at 60%.')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-invalid')).toBe('true');
  });

  it('has no axe violations determinate, indeterminate, complete and failed', async () => {
    const { container } = render(
      <>
        <Progress label="Determinate" value={40} />
        <Progress label="Indeterminate" />
        <Progress label="Done" value={100} valueText="Done" />
        <Progress label="Failed" value={20} error="Upload failed." />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
