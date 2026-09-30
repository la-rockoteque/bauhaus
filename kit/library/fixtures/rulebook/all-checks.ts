import { AUTO_CHECKS, type Check } from './checks';
import { CHECKS as clickables } from './checks-clickables';
import { CHECKS as dataStructures } from './checks-data-structures';
import { CHECKS as feedback } from './checks-feedback';
import { CHECKS as fields } from './checks-fields';
import { CHECKS as navigation } from './checks-navigation';
import { CHECKS as overlays } from './checks-overlays';
import { CHECKS as patterns } from './checks-patterns';

/** Every auto check: the foundations and primitives in auto-checks.ts, plus one file per family. */
export const ALL_CHECKS: Readonly<Record<string, Check>> = {
  ...AUTO_CHECKS, ...clickables, ...fields, ...navigation, ...feedback, ...overlays, ...dataStructures, ...patterns,
};
