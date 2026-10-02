#!/usr/bin/env bash
# Fixture: a small React app. Runs in the empty workspace (needs --scaffold).
set -euo pipefail
mkdir -p packages/design-system
cat > packages/design-system/package.json <<'BAUHAUS_FIXTURE_EOF'
{ "name": "@bauhaus/design-system", "version": "0.1.0", "peerDependencies": { "react": ">=18" }, "exports": { ".": "./index.ts" } }
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system
cat > packages/design-system/index.ts <<'BAUHAUS_FIXTURE_EOF'
export * from './components/clickables/button/button';
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/foundations/spacing
cat > packages/design-system/foundations/spacing/spacing.tokens.json <<'BAUHAUS_FIXTURE_EOF'
{ "space": { "1": { "$value": "4px", "$type": "dimension" }, "2": { "$value": "8px", "$type": "dimension" } } }
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/foundations/spacing
cat > packages/design-system/foundations/spacing/spacing.ts <<'BAUHAUS_FIXTURE_EOF'
import { Button } from '../../components/clickables/button/button';
export const spacingDemo = Button;
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/primitives/box
cat > packages/design-system/primitives/box/box.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';
import { TextField } from '../../components/fields/text-field/text-field';

export function Box({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 'var(--ds-space-inset-md)' }}>{children}<TextField label="x" /></div>;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/components/clickables/button
cat > packages/design-system/components/clickables/button/button.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

export function Button({ children }: { children: React.ReactNode }) {
  useDebounce(children, 10);
  return <button className="ds-button">{children}</button>;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/components/clickables/button
cat > packages/design-system/components/clickables/button/button.css <<'BAUHAUS_FIXTURE_EOF'
.ds-button { padding: var(--ds-space-inset-md); }
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/components/fields/text-field
cat > packages/design-system/components/fields/text-field/text-field.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';
import { useTranslation } from 'react-i18next';

export function TextField({ label }: { label: string }) {
  const { t } = useTranslation();
  return <label>{t(label)}<input /></label>;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/components/overlays/dialog
cat > packages/design-system/components/overlays/dialog/dialog.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';
import { Filtering } from '../../../patterns/filtering/filtering';

export function Dialog() {
  return <section role="dialog"><Filtering /></section>;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/patterns/filtering
cat > packages/design-system/patterns/filtering/filtering.tsx <<'BAUHAUS_FIXTURE_EOF'
import React from 'react';
import { Button } from '../../components/clickables/button/button';

export function Filtering() {
  return <div><Button>Apply</Button></div>;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/hooks
cat > packages/design-system/hooks/useDebounce.ts <<'BAUHAUS_FIXTURE_EOF'
export function useDebounce<T>(value: T, _ms: number): T {
  return value;
}
BAUHAUS_FIXTURE_EOF
mkdir -p packages/design-system/stories
cat > packages/design-system/stories/Button.stories.tsx <<'BAUHAUS_FIXTURE_EOF'
import { Button } from '../components/clickables/button/button';

export default { title: 'Button', component: Button };
BAUHAUS_FIXTURE_EOF
