import { Fragment, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

const INDENT = '  ';
const MAX_LINE = 80;

/** The tag a reader would type: the host tag, or the component's name. Storybook keeps names in its build (`keepNames`). */
function tagOf(type: unknown): string {
  if (typeof type === 'string') return type;
  if (type === Fragment) return '';
  const named = type as { displayName?: string; name?: string; render?: { displayName?: string; name?: string }; type?: unknown };
  return named.displayName || named.name || named.render?.displayName || named.render?.name || (named.type ? tagOf(named.type) : 'Component');
}

/** A prop value inside braces, as it would be written in source. A function prints by its prop name: the build minifies its body. */
function valueOf(value: unknown, name = 'fn'): string {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
  if (typeof value === 'function') return /^on[A-Z]/.test(name) ? '() => {}' : name;
  if (isValidElement(value)) return toJsx(value);
  if (Array.isArray(value)) return `[${value.map((item) => valueOf(item, name)).join(', ')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    return entries.length === 0 ? '{}' : `{ ${entries.map(([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${valueOf(v, k)}`).join(', ')} }`;
  }
  return String(value);
}

function propOf(name: string, value: unknown): string | null {
  if (value === undefined) return null;
  if (value === true) return name;
  if (typeof value === 'string' && !/["\n]/.test(value)) return `${name}="${value}"`;
  return `${name}={${valueOf(value, name)}}`;
}

/** Text as JSX children: braces and angle brackets escaped, so the snippet pastes as written. */
const textOf = (text: string) => text.replace(/[{}<>]/g, (c) => `{'${c}'}`);

function childrenOf(node: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  const walk = (child: ReactNode) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;
    if (Array.isArray(child)) child.forEach(walk);
    else if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) walk(child.props.children);
    else out.push(child);
  };
  walk(node);
  return out;
}

/** An element's lines joined onto one: no space where a tag meets a tag or text, so JSX renders none. */
const flat = (rows: string[]) =>
  rows.map((row) => row.trim()).reduce((out, row) => (out === '' ? row : out + (out.endsWith('>') || row.startsWith('<') ? '' : ' ') + row), '');

function lines(node: ReactNode, depth: number): string[] {
  const pad = INDENT.repeat(depth);
  if (typeof node === 'string' || typeof node === 'number') return [pad + textOf(String(node))];
  if (!isValidElement(node)) return [];
  const element = node as ReactElement<Record<string, unknown>>;
  const tag = tagOf(element.type);
  const { children, ...props } = element.props;
  const attrs = Object.entries(props).map(([name, value]) => propOf(name, value)).filter((attr): attr is string => attr !== null);
  const kids = childrenOf(children as ReactNode);

  const inlineOpen = `${pad}<${tag}${attrs.map((attr) => ` ${attr}`).join('')}`;
  const open = inlineOpen.length <= MAX_LINE || attrs.length < 2 ? [inlineOpen] : [`${pad}<${tag}`, ...attrs.map((attr) => `${pad}${INDENT}${attr}`)];
  const last = open.length - 1;
  const opening = (tail: string) => [...open.slice(0, last), open[last] + (open.length > 1 ? `\n${pad}${tail}` : tail)];

  if (kids.length === 0) return opening(open.length > 1 ? '/>' : ' />');
  const isText = (kid: ReactNode) => typeof kid === 'string' || typeof kid === 'number';
  // JSX drops whitespace that holds a line break, so text beside other children stays on one line with them.
  if (kids.some(isText) && (kids.length > 1 || open.length === 1)) {
    const inner = kids.map((kid) => (isText(kid) ? textOf(String(kid)) : flat(lines(kid, 0)))).join('');
    const inline = `${open.join('\n')}${open.length > 1 ? `\n${pad}` : ''}>${inner}</${tag}>`;
    if (kids.length > 1 || inline.length <= MAX_LINE) return [inline];
  }
  return [...opening('>'), ...kids.flatMap((kid) => lines(kid, depth + 1)), `${pad}</${tag}>`];
}

/**
 * Print a React element tree back as JSX source. An event handler prints as `() => {}`, any other function by its prop
 * name (`getHref={getHref}`): an example that teaches a function gives its own `code`. A context provider has no name and
 * prints as `Component`, and an element prop holding a fragment of several children prints them with no wrapper.
 */
export function toJsx(node: ReactNode): string {
  return childrenOf(node).flatMap((child) => lines(child, 0)).join('\n');
}
