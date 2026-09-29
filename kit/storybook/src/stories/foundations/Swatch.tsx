import type { Token } from './tokenSpecimens'

/** One colour token: the chip, its name, its value, and what it is for. */
export function Swatch({ token }: { token: Token }) {
  return (
    <div className="fnd__swatch">
      <div className="fnd__chip" style={{ background: `var(--mo-${token.name})` }} />
      <div className="fnd__meta">
        <code className="fnd__name">--mo-{token.name}</code>
        <code className="fnd__hex">{token.hex}</code>
        <span className="fnd__usage">{token.usage}</span>
      </div>
    </div>
  )
}
