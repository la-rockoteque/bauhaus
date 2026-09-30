#!/usr/bin/env bash
# Fixture: a small React app. Runs in the empty workspace (needs --scaffold).
set -euo pipefail
mkdir -p .
cat > package.json <<'BAUHAUS_FIXTURE_EOF'
{ "name": "orders-app", "private": true, "dependencies": { "react": "^18.3.0" } }
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Button.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

type Props = {
  variant?: 'primary' | 'secondary' | 'disabled';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ variant = 'primary', disabled, loading, children, onClick }: Props) {
  return (
    <button className={`btn btn--${variant}`} disabled={disabled || loading} onClick={onClick}>
      {loading ? 'Loading' : children}
    </button>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Btn.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

type Props = { kind?: 'primary' | 'secondary'; disabled?: boolean; busy?: boolean; label: string; onClick?: () => void };

export function Btn({ kind = 'primary', disabled, busy, label, onClick }: Props) {
  return (
    <button className={`btn btn--${kind}`} disabled={disabled || busy} onClick={onClick} style={{ padding: '5px 12px' }}>
      {busy ? '...' : label}
    </button>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/features/checkout
cat > src/features/checkout/SubmitButton.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

type Props = { variant?: 'primary' | 'secondary'; disabled?: boolean; loading?: boolean; children: React.ReactNode };

export function SubmitButton({ variant = 'primary', disabled, loading, children }: Props) {
  return (
    <button type="submit" className={`btn btn--${variant}`} disabled={disabled || loading} style={{ background: '#1a4fd6', color: '#fff' }}>
      {loading ? 'Saving' : children}
    </button>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Modal.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={title} style={{ padding: 24, zIndex: 9999 }}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Dialog.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

export function Dialog({ isOpen, heading, onDismiss, children }: { isOpen: boolean; heading: string; onDismiss: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay" onClick={onDismiss}>
      <section className="dialog" role="dialog" aria-label={heading} style={{ padding: 24 }}>
        <h2>{heading}</h2>
        {children}
      </section>
    </div>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/FilterBar.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

export function FilterBar({ onChange }: { onChange: (q: string) => void }) {
  return (
    <div className="filter" style={{ padding: '13px 16px' }}>
      <input placeholder="Filter" onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Table.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

export function Table({ rows }: { rows: string[][] }) {
  return (
    <table className="table" style={{ width: 900 }}>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/ui
cat > src/ui/Pager.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';

export function Pager({ page, onPage }: { page: number; onPage: (p: number) => void }) {
  return (
    <nav className="pager" style={{ marginTop: 5 }}>
      <button onClick={() => onPage(page - 1)}>Prev</button>
      <button onClick={() => onPage(page + 1)}>Next</button>
    </nav>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/pages
cat > src/pages/Orders.tsx <<'BAUHAUS_FIXTURE_EOF'
import React, { useState } from 'react';
import { FilterBar } from '../ui/FilterBar';
import { Table } from '../ui/Table';
import { Pager } from '../ui/Pager';
import { Button } from '../ui/Button';
import { Btn } from '../ui/Btn';
import { Modal } from '../ui/Modal';
import { useDebounce } from '../hooks/useDebounce';

export function Orders({ rows }: { rows: string[][] }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(q, 300);
  const shown = rows.filter((r) => r.join(' ').includes(debounced));
  return (
    <main>
      <FilterBar onChange={setQ} />
      <Button onClick={() => setOpen(true)}>New order</Button>
      <Btn label="Export" />
      {shown.length === 0 ? <p>No data</p> : <Table rows={shown} />}
      <Pager page={page} onPage={setPage} />
      <Modal open={open} title="New order" onClose={() => setOpen(false)}>Form here</Modal>
    </main>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/pages
cat > src/pages/Invoices.tsx <<'BAUHAUS_FIXTURE_EOF'
import React, { useState } from 'react';
import { FilterBar } from '../ui/FilterBar';
import { Table } from '../ui/Table';
import { Pager } from '../ui/Pager';
import { Btn } from '../ui/Btn';
import { Dialog } from '../ui/Dialog';

export function Invoices({ rows }: { rows: string[][] }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const shown = rows.filter((r) => r.join(' ').includes(q));
  return (
    <main>
      <FilterBar onChange={setQ} />
      <Btn label="Send" />
      {shown.length === 0 ? <p>No data</p> : <Table rows={shown} />}
      <Pager page={page} onPage={setPage} />
      <Dialog isOpen={open} heading="Confirm send" onDismiss={() => setOpen(false)}>Sure?</Dialog>
    </main>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/features/checkout
cat > src/features/checkout/Checkout.tsx <<'BAUHAUS_FIXTURE_EOF'
import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Btn } from '../../ui/Btn';
import { Modal } from '../../ui/Modal';
import { Dialog } from '../../ui/Dialog';
import { SubmitButton } from './SubmitButton';

export function Checkout() {
  const [open, setOpen] = useState(false);
  return (
    <form>
      <Button variant="secondary" onClick={() => setOpen(true)}>Review</Button>
      <Btn label="Back" />
      <SubmitButton>Pay</SubmitButton>
      <Modal open={open} title="Review" onClose={() => setOpen(false)}>Totals</Modal>
      <Dialog isOpen={open} heading="Pay" onDismiss={() => setOpen(false)}>Card</Dialog>
    </form>
  );
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/hooks
cat > src/hooks/useDebounce.ts <<'BAUHAUS_FIXTURE_EOF'
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
BAUHAUS_FIXTURE_EOF
mkdir -p src/stories
cat > src/stories/Button.stories.tsx <<'BAUHAUS_FIXTURE_EOF'
import { Button } from '../ui/Button';

export default { title: 'Button', component: Button };
export const Primary = { args: { children: 'Save' } };
BAUHAUS_FIXTURE_EOF
mkdir -p src/styles
cat > src/styles/app.css <<'BAUHAUS_FIXTURE_EOF'
:root { --brand: #1a4fd6; }
body { font-size: 16px; color: #333333; background: #ffffff; }
h1 { font-size: 25px; margin-bottom: 24px; }
h2 { font-size: 20px; margin-bottom: 16px; }
small { font-size: 12px; }
.btn { padding: 8px 16px; border-radius: 4px; background: #1a4fd6; color: #ffffff; transition: background 150ms ease; }
.btn--secondary { background: #e5e7eb; color: #333333; margin-left: 8px; }
.btn:hover { background: #163fa8; }
.card { padding: 16px; margin-bottom: 24px; border: 1px solid #d1d5db; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
.card + .card { margin-top: 8px; }
.toolbar { display: flex; gap: 8px; padding: 12px 16px; }
.toolbar .spacer { margin-right: 4px; }
.pager { margin-top: 5px; display: flex; gap: 8px; }
.filter { padding: 13px 16px; }
.table td { padding: 8px 12px; border-bottom: 1px solid #d1d5db; }
.table th { padding: 8px 12px; font-weight: 600; text-align: left; }
.modal { padding: 24px; border-radius: 8px; transition: opacity 200ms ease-in-out; }
.dialog { padding: 24px; border-radius: 8px; transition: opacity 300ms ease-in-out; }
.badge { padding: 4px 8px; border-radius: 999px; background: #0a7d5c; color: #ffffff; }
@media (max-width: 768px) { .toolbar { flex-direction: column; } }
@media (max-width: 1024px) { .card { padding: 12px; } }
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis
cat > .bauhaus/analysis/01-scope.json <<'BAUHAUS_FIXTURE_EOF'
{
  "root": "src",
  "stack": {
    "framework": "react",
    "styling": "css"
  },
  "files": 16,
  "byExt": {
    "tsx": 13,
    "ts": 1,
    "css": 1
  },
  "ignored": [
    "node_modules",
    "dist"
  ],
  "generatedAt": "2026-09-01T09:00:00.000Z"
}
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis
cat > .bauhaus/analysis/01-scope.md <<'BAUHAUS_FIXTURE_EOF'
# Scope

React + CSS, 16 files under src. Users: internal staff on desktop.

## Decisions

- Scope: src/.
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis/02-values
cat > .bauhaus/analysis/02-values/inventory.json <<'BAUHAUS_FIXTURE_EOF'
{
  "color": [
    {
      "value": "#1a4fd6",
      "count": 4
    }
  ],
  "spacing": [
    {
      "value": "8px",
      "count": 9
    },
    {
      "value": "16px",
      "count": 7
    },
    {
      "value": "5px",
      "count": 2
    }
  ]
}
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis/02-values
cat > .bauhaus/analysis/02-values/custom-properties.json <<'BAUHAUS_FIXTURE_EOF'
{
  "--brand": "#1a4fd6"
}
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis/02-values
cat > .bauhaus/analysis/02-values/tokens.draft.json <<'BAUHAUS_FIXTURE_EOF'
{
  "color": {
    "brand": {
      "$value": "#1a4fd6",
      "$type": "color"
    }
  }
}
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis/02-values
cat > .bauhaus/analysis/02-values/report.md <<'BAUHAUS_FIXTURE_EOF'
# Values

4 colours, 3 spacing values.
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis
cat > .bauhaus/analysis/03-foundations.json <<'BAUHAUS_FIXTURE_EOF'
{
  "spacing": {
    "base": 4,
    "fit": 0.9,
    "steps": [
      4,
      8,
      12,
      16,
      24
    ],
    "outliers": [
      {
        "value": "5px",
        "count": 2,
        "nearest": 4,
        "delta": 1
      }
    ]
  },
  "fontSize": {
    "base": 16,
    "ratio": 1.25,
    "fit": 0.8,
    "steps": [
      12,
      16,
      20,
      25
    ],
    "outliers": []
  }
}
BAUHAUS_FIXTURE_EOF
mkdir -p .bauhaus/analysis
cat > .bauhaus/analysis/03-foundations.md <<'BAUHAUS_FIXTURE_EOF'
# Foundations

Spacing base 4, fit 0.90.

## Decisions

- Spacing: accept base 4.
BAUHAUS_FIXTURE_EOF
