import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocPage } from '../../fixtures/doc-page/doc-page';
import { AdvisoriesPage } from '../../fixtures/advisories/advisories';
import { FocusRing } from '../../fixtures/specimens/specimens';
import { ExamplesPage } from '../../fixtures/examples/examples';
import { Button } from '../../components/clickables/button/button';
import { Link } from '../../components/clickables/link/link';
import { focusRules } from './focus.rules';

const meta = { title: 'Foundations/Focus', parameters: { layout: 'fullscreen' } } satisfies Meta;

export default meta;

export const Showcase: StoryObj = {
  name: 'Showcase',
  render: () => (
    <DocPage
      name="Focus"
      layer="Foundation"
      plain="Focus is the mark that shows which control the keyboard will act on. Without it, keyboard users are lost."
      precise="Foundation · the focus ring: width, offset and colour · drawn on :focus-visible for every interactive component."
      usedFor="Every interactive component: buttons, fields, links, tabs."
      tokens={{
        mode: 'defined',
        rows: [
          { name: 'focus.ring.width', tier: '2', use: '2px' },
          { name: 'focus.ring.offset', tier: '2', use: '2px' },
          { name: 'focus.ring.color', tier: 'role', use: 'Defined per theme; aliases colors.primary.*', swatch: '--ds-focus-ring-color' },
        ],
      }}
      specimens={<FocusRing />}
      specs={[
        { label: 'Outline', value: 'outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color)' },
        { label: 'Offset', value: 'outline-offset from focus.ring.offset, so the ring sits on the page and not on the control fill' },
        { label: 'Trigger', value: ':focus-visible; mouse presses do not show it' },
      ]}
      conditions={{
        cells: [],
        reason: 'No user setting changes the ring. The Stage shows it as every component draws it on :focus-visible.',
      }}
      dos={[
        { text: 'Draw the ring on every interactive component.', basis: 'WCAG 2.4.7 (AA)' },
        { text: 'Keep the ring at 3:1 against the surface in both themes.', basis: 'WCAG 1.4.11 (AA)' },
        { text: 'Keep a focused control from hiding under a sticky header.', basis: 'WCAG 2.4.11 (AA)' },
      ]}
      donts={[
        { text: 'Write outline: none with no replacement.', basis: 'WCAG 2.4.7 (AA)', rule: 'focus.never-removed' },
        { text: 'Colour the ring like the fill.', basis: 'WCAG 1.4.11 (AA)', rule: 'focus.ring-contrast' },
        { text: 'Draw a 1px ring.', basis: 'House standard, 2px minimum', rule: 'focus.ring-min-width' },
      ]}
      guide="foundations-focus--docs"
      guideName="Focus"
    />
  ),
};

export const Advisories: StoryObj = {
  name: 'Advisories',
  render: () => <AdvisoriesPage name="Focus" layer="Foundation" scope={['focus-visible', 'focus-not-obscured', 'contrast-ui']} rules={focusRules} guide="foundations-focus--docs" guideName="Focus" />,
};

// The ring as the CSS snippets below draw it. A foundation render may use inline `style` with `var(--ds-…)` only.
const ring = {
  outline: 'var(--ds-focus-ring-width) solid var(--ds-focus-ring-color)',
  outlineOffset: 'var(--ds-focus-ring-offset)',
};

const tile = {
  display: 'inline-block',
  padding: 'var(--ds-space-2) var(--ds-space-4)',
  background: 'var(--ds-surface-default)',
  color: 'var(--ds-text-default)',
  border: 'var(--ds-size-border-thin) solid var(--ds-border-strong)',
};

export const Examples: StoryObj = {
  name: 'Examples',
  render: () => (
    <ExamplesPage
      name="Focus"
      layer="Foundation"
      family="Foundations"
      imports={`import '@bauhaus/design-system/tokens.css'; // defines the --ds-focus-ring-* variables
import { Button, Link } from '@bauhaus/design-system';`}
      intro={[
        'Focus is the mark that shows which control the keyboard will act on. Press Tab on any page: the control that gets an outline has focus. The outline is the focus ring.',
        'Without a ring, a keyboard user cannot tell where they are. Without a visible ring, the page fails WCAG 2.4.7 (Focus Visible, AA).',
        'Three tokens describe the ring: `--ds-focus-ring-width` (2px), `--ds-focus-ring-offset` (2px, the gap between the control and the ring) and `--ds-focus-ring-color` (blue, and it changes per theme).',
        'Every component of the library draws this ring already. You write the CSS below only for a control you build yourself.',
        '`:focus-visible` is a CSS selector. The browser matches it after keyboard use and skips it after a mouse click on a button or a link. Mouse users see no ring there; keyboard users always do. A text field is the exception: it shows the ring on a mouse click too, because the user types into it.',
      ]}
      guide="foundations-focus--docs"
      guideName="Focus"
      groups={[
        {
          title: 'The ring on library components',
          kicker: 'Start here. You do nothing and the ring appears.',
          examples: [
            {
              title: 'Components draw the ring for you',
              when: 'You use a Button, a Link or a TextField.',
              explain: [
                'Press Tab to move the focus to each control. The ring appears around the focused one. Click a button or a link with the mouse and no ring shows, which is the intended behaviour. A `TextField` shows its ring on a click too, because `:focus-visible` matches a text field.',
                'Do not add `outline: none` on a library component. You would remove the only mark that keyboard users have.',
                'The ring has a 2px offset, so it sits outside the filled button and stays visible on the primary fill (WCAG 1.4.11, AA).',
              ],
              render: (
                <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button>Save</Button>
                  <Link href="#help">Help</Link>
                </div>
              ),
              code: `// Press Tab. Each of these gets the focus ring, with no CSS from you.
<Button onClick={save}>Save</Button>
<Link href="/help">Help</Link>`,
            },
          ],
        },
        {
          title: 'The ring in your own CSS',
          kicker: 'For a control you style yourself. Use the three tokens, never fixed numbers.',
          examples: [
            {
              title: 'The standard ring',
              when: 'You style a button, link or custom control.',
              explain: [
                '`outline` draws the ring. It does not change the size of the control, so nothing shifts when the ring appears.',
                '`:focus-visible` shows the ring for keyboard users only. If you wrote `:focus`, mouse clicks would show it too and many users would find it noisy.',
                '`outline-offset` leaves a gap between the control and the ring. The gap keeps the ring visible against the control fill.',
                'Without these lines the browser draws its own default ring. Do not set `outline: none` unless you put another ring in its place (WCAG 2.4.7, AA).',
              ],
              render: <span style={{ ...tile, ...ring }}>Focused control</span>,
              lang: 'css',
              code: `.my-control:focus-visible {
  /* Width, style, colour: the three tokens give a 2px solid ring. */
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  /* A gap so the ring never merges with the control fill. */
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
            {
              title: 'Keep the ring off the fill',
              when: 'A filled control, such as a primary-looking button.',
              explain: [
                'The offset moves the ring onto the page, not onto the fill. A blue ring touching a blue fill vanishes.',
                'If you set the ring colour to the fill colour, the ring becomes invisible. Keep `--ds-focus-ring-color`.',
              ],
              render: (
                <span style={{ display: 'inline-block', padding: 'var(--ds-space-2) var(--ds-space-4)', background: 'var(--ds-action-primary)', color: 'var(--ds-action-primary-text)', ...ring }}>
                  Publish
                </span>
              ),
              lang: 'css',
              code: `.my-primary {
  background: var(--ds-action-primary);
  color: var(--ds-action-primary-text);
}
.my-primary:focus-visible {
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  /* This gap is what keeps a blue ring visible next to a blue fill. */
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
            {
              title: 'A ring inside a clipped box',
              when: 'The control sits in a scrolling list or a box with overflow hidden.',
              explain: [
                'A box with `overflow: auto` or `hidden` cuts off anything outside it, ring included. The cut ring is half a ring.',
                'Add padding to the box that equals the offset plus the width (4px, which is `--ds-space-1`). The ring then fits inside.',
                'Do not shrink the offset to zero to fix this. The ring loses its gap on filled controls.',
              ],
              render: (
                <div style={{ overflow: 'auto', padding: 'var(--ds-space-1)', border: 'var(--ds-size-border-thin) solid var(--ds-border-default)' }}>
                  <span style={{ ...tile, ...ring }}>First item</span>
                </div>
              ),
              lang: 'css',
              code: `.scroll-area {
  overflow: auto;
  /* ring width 2px + offset 2px = 4px = space-1.
     The padding keeps the ring inside the clipping box. */
  padding: var(--ds-space-1);
}`,
            },
            {
              title: 'Show a skip link on focus',
              when: 'A "Skip to content" link lets keyboard users jump past the navigation.',
              explain: [
                'The link hides off screen until it gets focus. Then it slides into view with the ring, so the user sees where they are (WCAG 2.4.1 Bypass Blocks, A, and 2.4.7).',
                'Do not hide it with `display: none`. A hidden link cannot take focus.',
              ],
              lang: 'css',
              code: `.skip-link {
  position: absolute;
  /* Off screen, but still focusable. */
  inset-inline-start: -999px;
}
.skip-link:focus-visible {
  inset-inline-start: var(--ds-space-4);
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
          ],
        },
        {
          title: 'Themes and conditions',
          kicker: 'The ring keeps its contrast whatever the colours or the user settings.',
          examples: [
            {
              title: 'The ring in light and dark',
              when: 'Your app has both themes.',
              explain: [
                '`--ds-focus-ring-color` is `primary-600` in the light theme and `primary-300` in the dark theme. Both reach 3:1 on their page (WCAG 1.4.11, AA).',
                'You write the ring once. The theme changes the value behind the name.',
              ],
              render: (
                <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
                  {(['light', 'dark'] as const).map((theme) => (
                    <div key={theme} data-theme={theme} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-surface-default)' }}>
                      <span style={{ ...tile, ...ring }}>{theme} theme</span>
                    </div>
                  ))}
                </div>
              ),
              lang: 'css',
              code: `/* One rule. data-theme="dark" on an ancestor changes the colour value. */
.my-control:focus-visible {
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
            {
              title: 'Forced colors',
              when: 'The user runs Windows High Contrast, which replaces page colours.',
              explain: [
                'Forced-colors mode keeps `outline` and repaints it in a system colour. A ring drawn with `outline` survives.',
                'The mode removes shadows, so a ring made of `box-shadow` would vanish. This is why the library draws the ring with `outline`.',
              ],
              lang: 'css',
              code: `/* An outline stays visible in forced colors: the mode repaints it.
   No extra rule is needed. */
.my-control:focus-visible {
  outline: var(--ds-focus-ring-width) solid var(--ds-focus-ring-color);
  outline-offset: var(--ds-focus-ring-offset);
}`,
            },
            {
              title: 'Do not hide the focused control',
              when: 'The page has a sticky header or footer.',
              explain: [
                'Tab can move focus under a sticky header, so the user cannot see it. `scroll-padding-block-start` tells the browser to leave room when it scrolls to a focused control.',
                'Set the value to the height of the sticky bar (WCAG 2.4.11 Focus Not Obscured, AA).',
                'Give the sticky header a z-index from the scale (`--ds-z-sticky`), never a bare number.',
              ],
              lang: 'css',
              code: `html {
  /* The header is 48px tall (space-12): keep the focused control below it. */
  scroll-padding-block-start: var(--ds-space-12);
}
.site-header {
  position: sticky;
  inset-block-start: 0;
  block-size: var(--ds-space-12);
  z-index: var(--ds-z-sticky);
}`,
            },
          ],
        },
        {
          title: 'Moving focus yourself',
          kicker: 'Sometimes the page changes and the focus would be lost. Put it where the user needs it.',
          examples: [
            {
              title: 'Focus a heading after navigation',
              when: 'A single-page app loads a new view without a page reload.',
              explain: [
                'A real page load resets the focus to the top. A client-side route change does not, so the focus stays on a link that may no longer exist.',
                '`tabIndex={-1}` makes the heading focusable by script but keeps it out of the Tab order. The user does not stop on it by accident.',
                '`ref.current.focus()` runs after the new view renders. Screen readers then read the new title (WCAG 2.4.3 Focus Order, A).',
              ],
              lang: 'tsx',
              code: `import { useEffect, useRef } from 'react';

function OrdersPage() {
  const heading = useRef(null);

  // Runs once, when this view first shows.
  useEffect(() => {
    heading.current.focus();
  }, []);

  return (
    // tabIndex -1: focusable by code, not by the Tab key.
    // The ring shows only if the user arrived by keyboard.
    <h1 ref={heading} tabIndex={-1}>Orders</h1>
  );
}`,
            },
            {
              title: 'Give focus back after a dialog closes',
              when: 'A dialog opens from a button and closes again.',
              explain: [
                'Remember the button that opened the dialog. On close, focus it again. The user continues from where they left off.',
                'The `Modal`, `Popover` and `Menu` components already do this. Write it by hand only for a dialog you built yourself.',
              ],
              lang: 'ts',
              code: `let opener = null;

function openDialog() {
  // Remember who had focus before the dialog took it.
  opener = document.activeElement;
  dialog.showModal();
}

function closeDialog() {
  dialog.close();
  // Put the user back where they were.
  opener.focus();
}`,
            },
          ],
        },
      ]}
    />
  ),
};
