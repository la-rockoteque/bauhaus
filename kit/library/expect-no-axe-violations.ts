import axe from 'axe-core';
import { expect } from 'vitest';

// jsdom has no layout or paint, so these rules cannot run: colour contrast (real pixels) and the
// page-level landmark rule (a test renders a fragment, not a page). Contrast is checked on the
// tokens by pairs.json instead.
const JSDOM_BLIND = ['color-contrast', 'region'];

/** Run axe-core on a rendered container. Fails with one line per violation and the offending HTML. */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, { rules: Object.fromEntries(JSDOM_BLIND.map((id) => [id, { enabled: false }])) });
  const lines = results.violations.map(({ id, impact, help, nodes }) => `${id} (${impact}): ${help}\n${nodes.map((node) => `  ${node.html}`).join('\n')}`);
  expect(lines, `axe violations:\n${lines.join('\n')}`).toEqual([]);
}
