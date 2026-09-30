import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton, SkeletonRegion } from './skeleton';
import { expectNoAxeViolations } from '../../../expect-no-axe-violations';

describe('Skeleton', () => {
  it.each(['text', 'block', 'circle'] as const)('renders the %s shape, hidden from assistive technology', (shape) => {
    const { container } = render(<Skeleton shape={shape} />);
    const node = container.firstElementChild!;
    expect(node.className).toContain(`ds-skeleton--${shape}`);
    expect(node.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the requested lines of text, hidden as one', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstElementChild!.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.ds-skeleton--text')).toHaveLength(3);
  });

  it('takes a size as a token expression', () => {
    const { container } = render(<Skeleton shape="block" width="var(--ds-space-12)" height="var(--ds-space-8)" />);
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.inlineSize).toBe('var(--ds-space-12)');
    expect(style.blockSize).toBe('var(--ds-space-8)');
  });
});

describe('SkeletonRegion', () => {
  it('is busy and announces the label once while loading', () => {
    const { container } = render(<SkeletonRegion loading label="Loading 3 requisitions"><Skeleton lines={2} /></SkeletonRegion>);
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('Loading 3 requisitions');
  });

  it('is not busy and drops the status line once the content arrives', () => {
    const { container } = render(<SkeletonRegion loading={false} label="Loading"><p>Three requisitions</p></SkeletonRegion>);
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('false');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByText('Three requisitions')).toBeTruthy();
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(
      <SkeletonRegion loading label="Loading profile">
        <Skeleton shape="circle" /><Skeleton lines={3} /><Skeleton shape="block" />
      </SkeletonRegion>,
    );
    await expectNoAxeViolations(container);
  });
});
