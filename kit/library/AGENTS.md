<!-- bauhaus:start -->
## Bauhaus Design System

Import from `@bauhaus/design-system`. Never import from a slice folder.

**Look up before you build.** Read `bauhaus-manifest.json` first. It lists every component with its props, variants, tokens and rules. Reuse an existing component. Never re-implement one.

**Tokens.** Use role tokens (`--ds-*`) only. Never use a palette value or a raw hex colour.

| Component | Layer | What it is | Variants |
|---|---|---|---|
| `AlertDialog` | component | An alert dialog stops you to tell you something you must know before you go on. | - |
| `Badge` | component | A badge is a small pill that shows a number, such as 3 unread, or a status word, such as Paid. | - |
| `Banner` | component | A banner is a note that stays on the page until the problem is gone or you close it. | - |
| `Box` | primitive | A box is an empty container. | - |
| `Breadcrumb` | component | A breadcrumb shows the path from the top of the site down to the page you are on, like the trail of crumbs in… | - |
| `Button` | component | A button is the thing you press to make something happen. | primary, secondary, tertiary, subtle, danger |
| `Card` | component | A card is a bordered box that groups what you know about one thing: a title, some detail, a note at the botto… | - |
| `Checkbox` | component | A checkbox is a small box you tick to say yes. | - |
| `Chip` | component | A chip is a small pill that holds one value the user chose, such as a filter. | static, removable, selectable |
| `Combobox` | component | A combobox is a text box with a list of suggestions. | - |
| `ConfirmationDialog` | component | A confirmation dialog asks one yes-or-no question before an action goes ahead. | - |
| `CriticalConfirmationDialog` | component | A critical confirmation dialog stops the user before an action that cannot be undone and that also removes ot… | - |
| `Disclosure` | component | A disclosure is a heading you can press to show or hide a block of text under it. | - |
| `Divider` | primitive | A divider is a thin line that separates two groups of content. | - |
| `EmptyState` | component | An empty state is what a list or a page shows when there is nothing to show. | - |
| `Heading` | primitive | A heading is a title for the part of the page below it. | - |
| `Icon` | primitive | An icon is a small picture that stands for an action or a state, such as a check, a magnifying glass or a war… | - |
| `IconButton` | component | An icon button is a button drawn as a small picture, such as a cross to close. | - |
| `Link` | component | A link takes you somewhere else: another page, another site, another part of the same page. | - |
| `List` | component | A list is a stack of rows, one thing per row. | - |
| `Menu` | component | A menu is a short list of actions that opens from a button. | - |
| `MenuItem` | component | A menu item is one row in a menu: an action you can pick. | - |
| `Modal` | component | A modal is a small window that stops you and asks for a few details. | - |
| `Pagination` | component | Pagination cuts a long list into pages and lets you move between them, like the page numbers at the bottom of… | - |
| `Popover` | component | A popover is a small panel that appears next to the button you pressed. | - |
| `Progress` | component | A progress bar shows how far a long task has got, such as an upload. | - |
| `RadioGroup` | component | A radio group is a short list where you choose exactly one, and every choice is visible. | - |
| `Select` | component | A select is a drop-down list. | - |
| `Skeleton` | component | A skeleton is a grey outline of what is about to appear. | - |
| `Spinner` | component | A spinner is a small turning ring that says 'working on it'. | - |
| `Stack` | primitive | A stack puts things in a line, one after the other, with an even gap between them. | - |
| `Switch` | component | A switch is a light switch on screen. | - |
| `Table` | component | A table lays rows of facts along shared columns, so you can scan down a column and compare. | - |
| `Tabs` | component | Tabs let you flip between a few views of the same thing without leaving the page, like the tabs of a folder. | - |
| `Text` | primitive | Text is how words appear on screen. | body, caption, heading |
| `TextField` | component | A text field is a box where you type one line: your name, an email address, a search. | - |
| `Textarea` | component | A textarea is a text field with room for several lines: a message, a comment, an address. | - |
| `ToastRegion` | component | A toast is a small message that slides in to say that something happened, such as 'Draft saved', and goes awa… | - |
| `Tooltip` | component | A tooltip is a few words that pop up when you point at a button or tab to it. | - |
| `VisuallyHidden` | primitive | Some text is for screen readers only, such as 'opens in a new tab' or 'Close' next to an icon. | - |

**Patterns** (a recipe of components, see the manifest `composes` field): `destructive-actions`, `empty-results`, `filtering`, `form-validation`, `messaging`, `saving`.

Rules live in each slice as `<name>.rules.ts`. The manifest lists their ids.
<!-- bauhaus:end -->
