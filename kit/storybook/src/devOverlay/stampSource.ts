/**
 * Babel plugin: stamps every JSX host element with `data-mo-src="<path>:<line>"`.
 *
 * React 19 dropped `_debugSource` from its fibers (only `_debugStack` survives, an
 * Error whose stack needs source-map resolution to read), so there is no runtime way
 * back from a DOM node to the JSX that produced it. The attribute is that way back,
 * and it is what lets a finding reported as `Home.tsx:42` be painted over the element
 * line 42 rendered.
 *
 * Host elements only. `<Card>` takes props, not DOM attributes — stamping it would
 * either be dropped or leak the attribute onto whatever inner element spreads props.
 * A finding that lands on a component is recovered by `resolveAnchor`'s nearest-line
 * fallback instead.
 *
 * Wired in `vite.config.ts` for every mode but production, so a staging build (where
 * the flag can be switched on) carries the stamps and a production bundle does not.
 */

/** The attribute the stamp writes and `resolveAnchor` reads back. */
export const STAMP_ATTRIBUTE = 'data-mo-src'

export interface StampOptions {
  /** Absolute path the stamped reference is made relative to — the vite root. */
  root: string
}

interface StringLiteral {
  type: 'StringLiteral'
  value: string
}

interface JsxIdentifier {
  type: 'JSXIdentifier'
  name: string
}

interface JsxElementName {
  type: string
  name?: string
}

interface JsxAttribute {
  type: string
  name?: JsxElementName
}

interface JsxOpeningElement {
  name: JsxElementName
  attributes: JsxAttribute[]
  loc?: { start: { line: number } } | null
}

interface BabelTypes {
  jsxAttribute(name: JsxIdentifier, value: StringLiteral): JsxAttribute
  jsxIdentifier(name: string): JsxIdentifier
  stringLiteral(value: string): StringLiteral
}

/**
 * The reference written into the attribute: a path relative to `root`, forward-slashed
 * so it reads the same on every platform, then the 1-based line.
 */
export function sourceRef(root: string, filename: string, line: number): string {
  const relative = root && filename.startsWith(root) ? filename.slice(root.length) : filename
  return `${relative.replace(/\\/g, '/').replace(/^\//, '')}:${line}`
}

/**
 * Whether this element name renders a DOM node of its own. JSX spells host elements in
 * lowercase (`div`, `my-widget`) and components in upper camel case or as a member
 * expression (`Card`, `motion.div`).
 */
export function isHostElement(name: JsxElementName): boolean {
  return name.type === 'JSXIdentifier' && typeof name.name === 'string' && /^[a-z]/.test(name.name)
}

interface PluginState {
  filename?: string | null
  opts?: StampOptions
}

/** Whether this element already carries a stamp — a hand-written one is left alone. */
function hasStamp(attributes: JsxAttribute[]): boolean {
  return attributes.some(
    (attribute) => attribute.type === 'JSXAttribute' && attribute.name?.name === STAMP_ATTRIBUTE,
  )
}

/**
 * The overlay's own chrome, which is never the subject of a finding. Stamping it would
 * put the tool's markup among the anchors `resolveAnchor` scans and among the files the
 * inspect picker can return.
 */
const SELF = '/devOverlay/'

/** The reference this element should carry, or nothing when it is not one to stamp. */
function refFor(element: JsxOpeningElement, state: PluginState): string | null {
  const line = element.loc?.start.line

  if (!line || !state.filename || !isHostElement(element.name)) return null
  if (state.filename.replace(/\\/g, '/').includes(SELF)) return null

  return sourceRef(state.opts?.root ?? '', state.filename, line)
}

export default function stampSource({ types: t }: { types: BabelTypes }) {
  return {
    name: 'mo-stamp-source',
    visitor: {
      JSXOpeningElement(path: { node: JsxOpeningElement }, state: PluginState) {
        const ref = refFor(path.node, state)

        if (!ref || hasStamp(path.node.attributes)) return

        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier(STAMP_ATTRIBUTE), t.stringLiteral(ref)),
        )
      },
    },
  }
}
