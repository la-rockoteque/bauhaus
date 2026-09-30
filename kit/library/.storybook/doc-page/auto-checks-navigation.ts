import type { Check } from './auto-checks';

/**
 * Auto checks for the navigation slices, keyed by rule id. Build them from the helpers exported by
 * ./auto-checks (uses, sourceMatches, all, eachTheme, ratioAtLeast, pxAtLeast, noLiteral, textRole).
 * all-checks.ts merges this map into the registry the rulebook table grades against.
 */
export const CHECKS: Readonly<Record<string, Check>> = {};
